# 週次SEO記事下書き自動生成（Windowsタスクスケジューラから起動される想定）。
# claude CLIをヘッドレスモードで起動し、docs/pending-review.md に結果を追記する。
# git操作・ビルド・テストは行わない（許可ツールをRead/Edit/Glob/WebSearch/Taskのみに制限。
# Taskはドラフト完成後のセルフレビュー用サブエージェント起動にのみ使う）。
#
# 注意: Console.OutputEncoding はタスクスケジューラのような非対話実行（コンソール未接続）では
# 例外を投げるため使わない。cmd.exe 経由でファイルへリダイレクトし chcp 65001 でUTF-8を強制することで、
# PowerShellのパイプライン文字コードに依存せず日本語の文字化けを防ぐ。

$ProjectDir = "c:\Users\vanva\Clode Code\central-asia-guide"
Set-Location $ProjectDir

# rclone/claude がPATHに無い非対話実行環境向けに、Machine/UserのPATHを明示的に再構築する。
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")

$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)

# git のワーキングツリー変更ファイル一覧を集合（ハッシュテーブル）として取得する。
# porcelain 形式は "XY path"（先頭2桁がステータス、path は4文字目以降）。
# リネームは "orig -> new" 形式のため新名を採用する。
# claude -p にはgit権限を与えていない（Read,Edit,Glob,WebSearch,Taskのみ）ため、
# この検査はフルアクセス権限のスクリプト本体側（PowerShell）で行う。
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

$promptPath = Join-Path $ProjectDir "scripts\weekly-draft-prompt.md"
$logPath = Join-Path $ProjectDir "docs\pending-review.md"
$outFile = Join-Path $ProjectDir "scripts\.weekly-draft-output.tmp"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"

if (-not (Test-Path $logPath)) {
  $header = "# 記事下書きレビュー待ちログ`n`n週次自動生成の結果がここに追記されます。内容を確認し、問題なければ src/data/articles.js の該当記事の status を ""published"" に変更してコミット・プッシュしてください。`n"
  [System.IO.File]::WriteAllText($logPath, $header, $Utf8NoBom)
}

# ユーザーが指定のGoogle Driveフォルダに追加した実写真を取り込む（一方向pull・削除はしない）。
# ここでは公開判断は一切行わない。見出しに使う写真候補が増えるだけで、記事本文への採用可否は
# 後段のclaude（セルフレビュー込み）と人間レビューに委ねる。
$photoInboxFolderId = "18GVYkcrcDgbPoFxV4184d0uHJvv76j6m"
$photoInboxDir = Join-Path $ProjectDir "public\images\uzbekistan\inbox"
if (-not (Test-Path $photoInboxDir)) { New-Item -ItemType Directory -Path $photoInboxDir -Force | Out-Null }
rclone copy gdrive: $photoInboxDir --drive-root-folder-id $photoInboxFolderId

if (Test-Path $outFile) { Remove-Item $outFile -Force }

# claude 実行「前」のワーキングツリー状態を記録する。
# rclone が取り込んだ写真や、既存のダーティ状態は全てこのベースラインに含まれるため、
# 後段の差分検知では claude が新たに変更したファイルだけが浮かび上がる。
$beforeChangeSet = Get-GitChangedFileSet

$cmdLine = "chcp 65001 >nul && claude -p --allowedTools ""Read,Edit,Glob,WebSearch,Task"" < ""$promptPath"" > ""$outFile"" 2>&1"
cmd.exe /c $cmdLine

$result = if (Test-Path $outFile) { [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8) } else { "(出力なし)" }
Remove-Item $outFile -Force -ErrorAction SilentlyContinue

# claude 実行「後」の状態と比較し、想定外の追加編集を検知する。
# 想定内の変更: src/data/articles.js（記事本文の追記）と docs/seo-keywords.md（消化済みキーワードの印付け）。
# docs/pending-review.md はこのスクリプト自身が直後に追記するため検知対象から除外する。
# --allowedTools は git 操作を許可していないため、この検査は claude ではなくスクリプト本体で行う。
$expectedFiles = @("src/data/articles.js", "docs/seo-keywords.md")
$ignoredFiles  = @("docs/pending-review.md")
$afterChangeSet = Get-GitChangedFileSet
$unexpectedFiles = @()
foreach ($f in $afterChangeSet.Keys) {
  if ($beforeChangeSet.ContainsKey($f)) { continue }  # claude実行前から変更済み（rclone写真・既存ダーティ等）は対象外
  if ($expectedFiles -contains $f) { continue }
  if ($ignoredFiles -contains $f) { continue }
  $unexpectedFiles += $f
}

if ($unexpectedFiles.Count -gt 0) {
  $warning = "⚠️ 想定外のファイルが変更されています: " + ($unexpectedFiles -join ", ") + "。内容を必ず確認してください。`n`n"
  $entry = "`n## $timestamp`n$warning$result`n"
} else {
  $entry = "`n## $timestamp`n$result`n"
}
[System.IO.File]::AppendAllText($logPath, $entry, $Utf8NoBom)
