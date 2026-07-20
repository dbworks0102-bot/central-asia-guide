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

$cmdLine = "chcp 65001 >nul && claude -p --allowedTools ""Read,Edit,Glob,WebSearch,Task"" < ""$promptPath"" > ""$outFile"" 2>&1"
cmd.exe /c $cmdLine

$result = if (Test-Path $outFile) { [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8) } else { "(出力なし)" }
Remove-Item $outFile -Force -ErrorAction SilentlyContinue

$entry = "`n## $timestamp`n$result`n"
[System.IO.File]::AppendAllText($logPath, $entry, $Utf8NoBom)
