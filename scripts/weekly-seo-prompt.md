あなたは `c:\Users\vanva\Clode Code\central-asia-guide` （日本人旅行者向けウズベキスタン専門観光サイト、本番 https://tabi-uzbekistan.com）の
Google Search Consoleデータに基づくSEO改善を、無人スケジュール実行として任されています。この実行結果は
人間の確認なしにそのままcommit・push・本番反映されるため、**許可された3種類の変更以外は絶対に行わない**こと。

## 入力データ

`scripts/.seo-data/latest.json` を読む。構造は以下の通り：

```json
{
  "fetchedAt": "2026-...",
  "lowCtrPages": [{ "page": "https://tabi-uzbekistan.com/articles/xxx", "clicks": 1, "impressions": 40, "ctr": 0.025, "position": 8.2 }],
  "keywordGaps": [{ "query": "ウズベキスタン ...", "clicks": 0, "impressions": 25, "ctr": 0, "position": 14.3 }]
}
```

このファイルが存在しない、または `lowCtrPages` と `keywordGaps` が両方とも空配列の場合は、改善対象なしと判断し、
手順3以降に進まず「今回は改善対象なし」とだけ出力して終了する（ファイルは一切変更しない）。

## 許可される変更（この3種類のみ）

### 1. 低CTRページのtitle/description改善
`lowCtrPages` の各 `page` URLから `slug`（URL末尾の `/articles/<slug>`）を特定し、`src/data/articles.js` の
該当記事（`status: "published"` のもの限定。draft記事のURLはSearch Consoleに載らないはずだが、万一一致しても
絶対に変更しない）を探す。`title` と `description` が検索結果でクリックされにくい可能性がある表現
（曖昧・一般的すぎる等）であれば、記事本文（`body`）に既に書かれている**事実の範囲内**で、より具体的で
クリックを誘う表現に書き換える。新しい事実（料金・日付・制度等）を本文に無いのに補って書かない。
`title`・`description` フィールドのみ変更し、`body`・`keywords`・`heroImage`・`publishDate`・`status`・`slug` は
一切変更しない。

### 2. キーワード機会の追加
`keywordGaps` の各 `query` について、`docs/seo-keywords.md` の既存項目（チェック有無を問わず）や
`src/data/articles.js` の既存 `keywords` と重複しないか確認する。重複しない、かつサイトのテーマ
（ウズベキスタン観光）に合致するものだけを、`docs/seo-keywords.md` の適切なカテゴリ見出しの下に
未チェック項目（`- [ ] <query>`）として追加する（既存項目の書式に合わせる）。これは新規記事の題材候補を
増やすだけで、この実行では新規記事は作らない。

### 3. 内部リンク補強
`status: "published"` の記事同士で、話題（都市・観光地）が近いのに `relatedLinks` で互いにリンクしていない
ペアがあれば、`relatedLinks` に1〜2件追加する。既存の `relatedLinks` 項目は削除・変更しない。
`status: "draft"` の記事へは絶対にリンクしない。

## 制約
- 変更してよいファイルは `src/data/articles.js` と `docs/seo-keywords.md` の2つのみ。他のファイルは一切変更しない。
- **1回の実行で変更する記事は最大5件まで**（title/description改善・内部リンク追加を合わせて）。
  `lowCtrPages`・候補ペアが5件を超える場合は、影響が大きそうなもの（インプレッションが多い順）から選ぶ。
- `status`・`slug`・`publishDate`・`heroImage`・本文（`body`）の構造は絶対に変更しない
  （`body`はtitle/description改善のための参照読み取り専用）。
- 事実の捏造は絶対禁止。裏取りできない情報は書かない。
- ビルド・テスト・git操作は一切行わない（実行不可）。
- 最後に、`scripts/.seo-data/latest.json` の `fetchedAt`・変更した記事の `slug` と変更内容（title/description改善か
  内部リンク追加か）・追加したキーワード項目・変更件数（例:「記事3件・キーワード4件」）を数行で要約して出力する
  （これがログに残る）。改善対象なしだった場合もその旨を出力する。
