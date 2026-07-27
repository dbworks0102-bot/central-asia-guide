# 3日に1本の自動公開ローテーション（Windowsタスクスケジューラから起動される想定）。
# scripts/auto-publish.mjs が src/data/articles.js の出現順で最初の status:"draft" を
# published に切り替える → lint/test/build が通れば commit・push → 本番はVercelが自動デプロイ。
# いずれかの工程で失敗した場合は articles.js の変更を破棄し、コミット・pushは行わない。
#
# 注意: Console.OutputEncoding はタスクスケジューラのような非対話実行（コンソール未接続）では
# 例外を投げるため使わない。npm/git等ネイティブコマンドの2>&1もPowerShell 5.1では$?を汚すため、
# cmd.exe経由でファイルへリダイレクトしchcp 65001でUTF-8を強制する（weekly-draft.ps1と同じ方式）。

$ProjectDir = "c:\Users\vanva\Clode Code\central-asia-guide"
Set-Location $ProjectDir

$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")

$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$logPath = Join-Path $ProjectDir "docs\publish-log.md"
$outFile = Join-Path $ProjectDir "scripts\.auto-publish-output.tmp"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"

if (-not (Test-Path $logPath)) {
  $header = "# 自動公開ログ`n`n3日に1本のローテーションで src/data/articles.js のdraft記事をpublishedへ自動昇格した記録です。`n" +
            "対象順序・除外slugは scripts/auto-publish.mjs の SKIP_SLUGS を参照。`n"
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

# 1. 次に公開するdraftを選定し、articles.js を書き換える（未選定なら "NONE"）
$select = Invoke-Step "node scripts/auto-publish.mjs"
$selectedSlug = $select.Output.Trim()

if ($select.Exit -ne 0) {
  Write-Log "⚠️ auto-publish.mjs の実行に失敗しました。articles.js は変更されていません。`n``````n$($select.Output)`n``````"
  exit 1
}

if ($selectedSlug -eq "NONE") {
  Write-Log "公開対象のdraft記事がありません（ローテーション対象をすべて消化済み、または全件除外中）。"
  exit 0
}

# 2. lint → test → build の順にゲートを通す。いずれか失敗したら articles.js の変更を破棄する。
$gates = @(
  @{ Name = "lint";  Cmd = "npm run lint" },
  @{ Name = "test";  Cmd = "npm run test" },
  @{ Name = "build"; Cmd = "npm run build" }
)

foreach ($gate in $gates) {
  $result = Invoke-Step $gate.Cmd
  if ($result.Exit -ne 0) {
    git checkout -- src/data/articles.js
    Write-Log "⚠️ 「$selectedSlug」の公開を試みましたが $($gate.Name) が失敗したため中止し、articles.js の変更を破棄しました。`n``````n$($result.Output)`n``````"
    exit 1
  }
}

# 3. commit & push
git add src/data/articles.js
$commitMsg = "Auto-publish: $selectedSlug（3日ローテーション自動公開）"
git commit -m $commitMsg | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Log "⚠️ 「$selectedSlug」はlint/test/buildを通過しましたが、git commitに失敗しました。articles.jsの変更はワーキングツリーに残っています（要確認）。"
  exit 1
}

git push | Out-Null
if ($LASTEXITCODE -ne 0) {
  $hash = (git rev-parse --short HEAD).Trim()
  Write-Log "⚠️ 「$selectedSlug」をコミット（$hash）しましたが git push に失敗しました。手動で `git push` を実行してください。"
  exit 1
}

$hash = (git rev-parse --short HEAD).Trim()
Write-Log "「$selectedSlug」を公開しました（lint/test/build通過 → commit $hash → push済み。Vercelが自動デプロイします）。"
