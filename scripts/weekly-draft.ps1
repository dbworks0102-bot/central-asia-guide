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

$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)

$promptPath = Join-Path $ProjectDir "scripts\weekly-draft-prompt.md"
$logPath = Join-Path $ProjectDir "docs\pending-review.md"
$outFile = Join-Path $ProjectDir "scripts\.weekly-draft-output.tmp"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"

if (-not (Test-Path $logPath)) {
  $header = "# 記事下書きレビュー待ちログ`n`n週次自動生成の結果がここに追記されます。内容を確認し、問題なければ src/data/articles.js の該当記事の status を ""published"" に変更してコミット・プッシュしてください。`n"
  [System.IO.File]::WriteAllText($logPath, $header, $Utf8NoBom)
}

if (Test-Path $outFile) { Remove-Item $outFile -Force }

$cmdLine = "chcp 65001 >nul && claude -p --allowedTools ""Read,Edit,Glob,WebSearch,Task"" < ""$promptPath"" > ""$outFile"" 2>&1"
cmd.exe /c $cmdLine

$result = if (Test-Path $outFile) { [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8) } else { "(出力なし)" }
Remove-Item $outFile -Force -ErrorAction SilentlyContinue

$entry = "`n## $timestamp`n$result`n"
[System.IO.File]::AppendAllText($logPath, $entry, $Utf8NoBom)
