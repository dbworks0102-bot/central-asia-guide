あなたは `c:\Users\vanva\Clode Code\central-asia-guide` （日本人旅行者向けウズベキスタン専門観光サイト、本番 https://tabi-uzbekistan.com）の
SEOコラム記事の下書きを1本作成するタスクを、無人スケジュール実行として任されています。人間のレビュー前提なので、
必ず `status: "draft"` として追加してください（`"published"` にしてはいけません）。

## 手順

1. `docs/seo-keywords.md` を読み、チェックが付いていない（`- [ ]`）キーワード項目を1つ選ぶ。
2. `src/data/articles.js` を読み、既存の `slug`・`keywords` と重複しないことを確認する。
3. 選んだキーワードのトピックにビザ・治安・料金・開業日・就航状況など**事実性の高い情報**が含まれる場合は、
   必ずWebSearchで裏取りする。裏取りできない/古い可能性がある情報は書かない。曖昧な場合は「最新情報は公式情報を
   確認してください」と明記する。**新しい事実を捏造しない**こと。
4. `public/images/uzbekistan/` 配下の既存画像（Globで確認）から、記事内容に合う実写真を `heroImage` に選ぶ
   （新規画像は作らない・生成しない）。
5. `src/data/articles.js` の既存記事オブジェクトと同じスキーマ（`slug`, `title`, `description`, `keywords`,
   `heroImage`, `publishDate`, `status`, `body`, `relatedLinks`）に厳密に合わせて、新しい記事オブジェクトを
   配列の末尾に追記する（Editツールで直接編集。既存記事は変更しない）。
   - `status` は必ず `"draft"`。
   - `publishDate` は実行日（今日の日付、ISO形式）。
   - `body` は既存記事と同じブロック形式（`heading`/`paragraph`/`list`）。
   - `relatedLinks` はサイト内の `/` または `/about` へのリンクを最低1つ含める。
6. `docs/seo-keywords.md` の該当項目にチェックを入れ、末尾に ` → 下書き済み: <slug>` を追記する。
7. 最後に、生成した記事の `slug` ・`title`・使用したキーワードを1〜2行で要約して出力する（これがログに残る）。

## 制約
- **この実行で作成する記事は必ず1本だけ**。手順1〜7を1周したら終了し、続けて2本目以降を作成しない。
  （`docs/seo-keywords.md` に未使用項目が複数残っていても、選ぶのは1つだけ。）
- ビルド・テスト・git操作は一切行わない（実行不可）。
- `src/data/articles.js` と `docs/seo-keywords.md` 以外のファイルは変更しない。
- 既存の `status: "published"` の記事は絶対に変更しない。
- 手順7の要約には、この実行で `src/data/articles.js` に追記した記事の**件数**も明記すること（例:「1本作成」）。
  1本以外の件数になった場合は、その旨と理由を要約に必ず含めること。
