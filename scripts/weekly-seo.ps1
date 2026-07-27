# 週次アクセス解析＋自動SEO改善（Windowsタスクスケジューラから起動される想定）。
# 1. scripts/fetch-search-console-data.mjs でGoogle Search Consoleの直近28日データを取得・要約
# 2. claude -p ヘッドレスモードで scripts/weekly-seo-prompt.md の指示に従い、
#    低CTRページのtitle/description改善・キーワード機会の追加・内部リンク補強のみを実施
# 3. lint/test/build が通れば commit・push → 本番はVercelが自動デプロイ
# いずれかの工程で失敗、または想定外のファイルが変更された場合は articles.js / seo-keywords.md の
# 変更を破棄し、コミット・pushは行わない。
#
# 注意: Console.OutputEncoding はタスクスケジューラのような非対話実行（コンソール未接続）では
# 例外を投げるため使わない。npm/git等ネイティブコマンドの2>&1もPowerShell 5.1では$?を汚すため、
# cmd.exe経由でファイルへリダイレクトしchcp 65001でUTF-8を強制する（auto-publish.ps1と同じ方式）。

$ProjectDir = "c:\Users\vanva\Clode Code\central-asia-guide"
Set-Location $ProjectDir

$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")

$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$logPath = Join-Path $ProjectDir "docs\seo-improvement-log.md"
$promptPath = Join-Path $ProjectDir "scripts\weekly-seo-prompt.md"
$outFile = Join-Path $ProjectDir "scripts\.weekly-seo-output.tmp"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$expectedFiles = @("src/data/articles.js", "docs/seo-keywords.md")

if (-not (Test-Path $logPath)) {
  $header = "# 週次SEO改善ログ`n`nGoogle Search Consoleの週次データに基づき、低CTRページのtitle/description改善・" +
            "キーワード機会の追加・内部リンク補強を自動適用した記録です。詳細は docs/design.md §8.5.7 を参照。`n"
  [System.IO.File]::WriteAllText($logPath, $header, $Utf8NoBom)
}

function Invoke-Step($cmd) {
  if (Test-Path $outFile) { Remove-Item $outFile -Force }
  $cmdLine = "chcp 65001 >nul && $cmd > ""$outFile"" 2>&1"
  cmd.exe /c $cmdLine
  $exit = $LASTEXITCODE
  $text = if (Test-Path $outFile) { [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8) } else { "" }
  Remove-Item $outFile -Force -ErrorAction SilentlyContinue
  return @{ Exit = $exit; Output = $text }
}

function Write-Log($entry) {
  [System.IO.File]::AppendAllText($logPath, "`n## $timestamp`n$entry`n", $Utf8NoBom)
}

function Revert-ExpectedFiles {
  foreach ($f in $expectedFiles) {
    git checkout -- $f 2>$null
  }
}

# git のワーキングツリー変更ファイル一覧を集合として取得する（weekly-draft.ps1と同じロジック）。
function Get-GitChangedFileSet {
  $set = @{}
  $lines = git -C $ProjectDir status --porcelain 2>$null
  foreach ($line in $lines) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    if ($line.Length -le 3) { continue }
    $path = $line.Substring(3).Trim()
    if ($path -match ' -> ') { $path = ($path -split ' -> ')[-1].Trim() }
    $path = $path.Trim('"')
    $set[$path] = $true
  }
  return $set
}

# 1. Search Consoleデータ取得。認証情報未配置・API未有効化・ネットワークエラー等で失敗した場合は
#    ここで終了し、articles.js / seo-keywords.md には一切触れない。
$fetch = Invoke-Step "node scripts/fetch-search-console-data.mjs"
if ($fetch.Exit -ne 0) {
  Write-Log "⚠️ Search Consoleデータ取得に失敗しました（認証情報未配置の可能性）。`n```n$($fetch.Output)`n```"
  exit 1
}
if ($fetch.Output.Trim() -eq "NO_CREDENTIALS") {
  Write-Log "⚠️ サービスアカウント鍵（scripts/.secrets/search-console-service-account.json）が未配置のため実行を中止しました。セットアップ手順は docs/design.md §8.5.7 を参照してください。"
  exit 1
}

$beforeChangeSet = Get-GitChangedFileSet

# 2. claude -p ヘッドレスモードで改善を適用（git操作権限は与えない）
$cmdLine = "chcp 65001 >nul && claude -p --allowedTools ""Read,Edit,Glob"" < ""$promptPath"" > ""$outFile"" 2>&1"
cmd.exe /c $cmdLine
$claudeOutput = if (Test-Path $outFile) { [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8) } else { "(出力なし)" }
Remove-Item $outFile -Force -ErrorAction SilentlyContinue

$afterChangeSet = Get-GitChangedFileSet
$newlyChangedFiles = @()
foreach ($f in $afterChangeSet.Keys) {
  if ($beforeChangeSet.ContainsKey($f)) { continue }
  $newlyChangedFiles += $f
}

$unexpectedFiles = $newlyChangedFiles | Where-Object { $expectedFiles -notcontains $_ }
if ($unexpectedFiles.Count -gt 0) {
  Revert-ExpectedFiles
  $warning = "⚠️ 想定外のファイルが変更されたため中止し、src/data/articles.js・docs/seo-keywords.mdの変更を破棄しました" +
             "（他の想定外ファイルは確認のため残しています）: " + ($unexpectedFiles -join ", ")
  Write-Log "$warning`n`n$claudeOutput"
  exit 1
}

if ($newlyChangedFiles.Count -eq 0) {
  Write-Log "今回は改善対象なしと判断されたため、変更はありません。`n`n$claudeOutput"
  exit 0
}

# 3. lint → test → build の順にゲートを通す。いずれか失敗したら変更を破棄する。
$gates = @(
  @{ Name = "lint";  Cmd = "npm run lint" },
  @{ Name = "test";  Cmd = "npm run test" },
  @{ Name = "build"; Cmd = "npm run build" }
)

foreach ($gate in $gates) {
  $result = Invoke-Step $gate.Cmd
  if ($result.Exit -ne 0) {
    Revert-ExpectedFiles
    Write-Log "⚠️ SEO改善を試みましたが $($gate.Name) が失敗したため中止し、変更を破棄しました。`n`n$claudeOutput`n`n``````n$($result.Output)`n``````"
    exit 1
  }
}

# 4. commit & push
git add src/data/articles.js docs/seo-keywords.md
git commit -m "Weekly SEO improvement（週次アクセス解析に基づく自動改善）" | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Log "⚠️ lint/test/buildを通過しましたが、git commitに失敗しました。変更はワーキングツリーに残っています（要確認）。`n`n$claudeOutput"
  exit 1
}

git push | Out-Null
if ($LASTEXITCODE -ne 0) {
  $hash = (git rev-parse --short HEAD).Trim()
  Write-Log "⚠️ コミット（$hash）しましたが git push に失敗しました。手動で `git push` を実行してください。`n`n$claudeOutput"
  exit 1
}

$hash = (git rev-parse --short HEAD).Trim()
Write-Log "SEO改善を適用しました（lint/test/build通過 → commit $hash → push済み。Vercelが自動デプロイします）。`n`n$claudeOutput"
