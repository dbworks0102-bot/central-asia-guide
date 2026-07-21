# タスクリスト — ウズベキスタン旅行ガイド（central-asia-guide）

`docs/design.md` を実装可能な粒度に分解したタスク一覧。開発標準のフロー（Step1〜8）に沿った順序で記載する。
上から順に着手し、各ステップ完了時にチェックを入れる。

---

## Step 0. ウズベキスタン専門サイトへの方針転換（実施済み）
- [x] キルギスのデータ・画像・国選択UIを全削除（`data/kyrgyzstan.js`・`ui/renderTopPage.js`・`components/renderCountryCard.js`・`public/images/kyrgyzstan/`）
- [x] トップ `/` をウズベキスタンのガイド本体（`renderCountryPage`）に変更。`/:countryId` 動的ルートは廃止
- [x] ブランディング（siteName / tagline / index.html メタ・OGP / package.json description）をウズベキスタン専門に更新
- [x] ドキュメント（requirements / design / tasks）を単一国アーキテクチャに更新
- [x] 単体テスト・E2Eテストを単一国前提に更新（Red→Green）

---

## Step 1. ドキュメント作成
- [x] requirements.md 作成
- [x] design.md 作成
- [x] tasks.md 作成
- [x] 3ドキュメントの内容整合性を最終レビュー（2026-07-20、`Agent(model:"fable")`によるレビュー実施。指摘事項はStep 10参照）

## Step 2. 環境構築・プロジェクト初期化
- [x] Vite プロジェクト初期化（vanilla JS）
- [x] `package.json` にスクリプト定義（dev / build / preview / test / test:e2e）
- [x] Vitest 導入・設定（`vitest.config.js`）
- [x] Playwright 導入・設定（`playwright.config.js`）
- [x] ディレクトリ構成を design.md 準拠で作成（src/data・core・ui・utils, tests/unit・e2e）
- [x] `index.html` の骨組み（基本メタタグ・viewport・charset・ルートコンテナ）
- [x] ESLint/Prettier など基本整備 → ESLintのみ導入（Step 10-8参照。Prettierは現状の規模では未導入）

## Step 3. テスト先行（Red）— ユニット
- [x] `tests/unit/getCountryData.test.js`
- [x] `tests/unit/getAllCountries.test.js`
- [x] `tests/unit/validateCountry.test.js`
- [x] `tests/unit/meta.test.js`
- [x] `tests/unit/labels.test.js`
- [x] `tests/unit/dataIntegrity.test.js`
- [x] Red→Green手順で実施済み（現在は全てGreenで運用中）

## Step 4. 実装（Green）
### 4-1. データ層
- [x] `src/utils/labels.js`
- [x] `src/data/uzbekistan.js`
- [x] `src/data/index.js`
### 4-2. コアロジック
- [x] `src/core/validateCountry.js`
- [x] `src/core/getCountryData.js`
- [x] `src/core/getAllCountries.js`
### 4-3. ユーティリティ
- [x] `src/utils/dom.js`
- [x] `src/utils/meta.js`
### 4-4. UI 描画層
- [x] `src/ui/components/renderHeader.js`
- [x] `src/ui/components/renderFooter.js`
- [x] `src/ui/components/renderModelCourse.js`
- [x] `src/ui/components/renderAttraction.js`（objectFit:contain時 dominantColor 背景対応済み）
- [x] `src/ui/renderCountryPage.js`
- [x] `src/ui/renderAboutPage.js`
- [x] `src/ui/renderNotFound.js`
### 4-5. ルーティング・初期化
- [x] `src/router.js`
- [x] `src/main.js`
- [x] CSS（`src/styles.css`、モバイルファースト対応）
- [x] ユニットテストが全て Green（2026-07-20時点：38件全パス）

## Step 5. リファクタリング（Refactor）
- [x] 重複コードの共通化（DRY）・命名整理
- [x] レイヤー依存方向の確認（core が ui に依存していないこと。Fableレビューでdraft/published判定の`core/getArticles.js`一元化を確認済み）
- [x] マジックナンバー・文字列の定数化（`labels.js`等に集約）
- [x] リファクタ後もユニットテストが Green であることを確認

## Step 6. E2Eテスト（Playwright）
- [x] `tests/e2e/countryPage.spec.js`
- [x] `tests/e2e/modelCourse.spec.js`
- [x] `tests/e2e/attractions.spec.js`
- [x] `tests/e2e/navigation.spec.js`
- [x] `tests/e2e/notFound.spec.js`
- [x] `tests/e2e/responsive.spec.js`
- [x] `tests/e2e/articles.spec.js`（Step 9で追加）
- [x] 全E2Eシナリオが通ることを確認（2026-07-20再検証：13件全パス）

## Step 7. ビルド確認
- [x] `npm run build` でビルドエラーゼロを確認（2026-07-20再確認済み）
- [x] `npm run preview` で本番ビルドの表示確認（2026-07-20実施）
- [ ] Lighthouse でパフォーマンス90以上・SEO・アクセシビリティを確認（未実施）
- [x] **OGP/メタタグ/構造化データが各ページで正しく出力されるか確認 → Step 10-1のプリレンダリング実装で解消済み（2026-07-20）**：`npm run build`後の`dist/`静的HTMLに対し`npm run preview`+`curl`で再検証。published記事URLは記事別`<title>`/`og:title`/`og:url`/JSON-LDが正しく出力され、draft記事URLはサイト汎用メタへのSPAフォールバックのままであることを確認した。

## Step 8. バックアップ・デプロイ
- [x] Google Drive `gdrive:dev/central-asia-guide` へ差分バックアップ（直近: 2026-07-20実施）
- [x] `vercel.json`（SPA fallback rewrites）を作成
- [x] Vercel へデプロイ（本番: tabi-uzbekistan.com）
- [x] 本番URLで表示・遷移・OGP を確認（Lighthouseは未実施、Step 7参照）

---

## Step 9. 記事システム（SEOコラム）— 実装済み
TDD（Red→Green）で実装。公開判定は core 層に集約し、draft が一覧・詳細・sitemap に漏れないことを担保。
- [x] `tests/unit/articles.test.js`（buildArticleMeta/buildArticleJsonLd・core公開フィルタ・データ整合性）Red→Green
- [x] `tests/e2e/articles.spec.js`（一覧表示・詳細遷移・直接アクセス・未存在/下書きslug→404）
- [x] `src/data/articles.js`（記事データ。サンプル1本=published、下書き0件）
- [x] `src/core/getArticles.js`（selectPublished / findPublished / 実データ用ラッパ）
- [x] `src/utils/meta.js` 拡張（buildArticleMeta / buildArticleJsonLd）
- [x] `src/utils/formatDate.js`（ISO日付→日本語表記）
- [x] `src/ui/renderArticleListPage.js` / `src/ui/renderArticleDetailPage.js`
- [x] `src/router.js` に `/articles`・`/articles/:slug`（published のみ・draft/未存在は404）を追加
- [x] ヘッダー/フッターに「コラム」導線を追加、`labels.js` に記事ラベルを追加、`styles.css` に記事スタイルを追加
- [x] `scripts/generate-sitemap.js`（published＋静的ルートのみ）・`package.json` の `prebuild` 連携
- [x] `public/robots.txt` に `Sitemap:` 行を追記
- [x] `npm run test` / `npm run build` がエラーゼロで通ることを確認

### 週次自動生成パイプライン — 実装済み（2026-07-20）
- [x] 週1回の無人パイプラインが `status:"draft"` 記事を `src/data/articles.js` に追記（`scripts/weekly-draft.ps1` + `scripts/weekly-draft-prompt.md`、タスクスケジューラ登録名`central-asia-guide-weekly-draft`）
- [x] 人間レビュー→承認で `published` へ昇格して公開する運用（`docs/pending-review.md`にログ集約）
- [x] セルフレビュー工程（`Agent(model:"opus")`による独立チェック）を追加
- [x] 写真取り込み機能（Googleドライブ指定フォルダから`rclone`で一方向pull、`public/images/uzbekistan/inbox/`）

---

## Step 10. Fable設計レビュー対応（2026-07-20実施）
`Agent(model:"fable")`による全体設計レビューで判明した指摘事項。重大→中程度→軽微の順。

### 重大
- [x] **10-1. SPAのCSRにより記事別OGP/構造化データがJS非実行のスクレイパー（SNSシェア等）に反映されない**：`src/core/routeMeta.js`（メタ生成の一元化）＋`scripts/prerender-meta.js`（`build`後にpublished記事のみ静的HTML生成、draftは除外）を実装。`npm run build`/`test`/`test:e2e`全パス、`curl`でpublished記事別メタ・draft記事フォールバックの両方を実機再検証済み（2026-07-20）
- [x] **10-2. 週次自動化の「対象外ファイル改変禁止」「1本のみ生成」制約が技術的に未強制**：`weekly-draft.ps1`にclaude実行前後の`git status --porcelain`差分検知を追加。`src/data/articles.js`・`docs/seo-keywords.md`以外の変更があれば`docs/pending-review.md`のログ冒頭に警告を挿入する。git検査はPowerShell本体側で実施し`--allowedTools`にgit権限は追加していない。UTF-8 BOM維持・構文チェック済み（2026-07-20）

### 中程度
- [x] **10-3. `tests/e2e/articles.spec.js`が実在するdraft記事での直接アクセス404を検証していない**：`src/data/articles.js`から`status:"draft"`の記事を動的に1件選ぶテストケースを追加（ハードコードなし・将来publishedへ昇格しても壊れない）。E2E14件全パス確認済み（2026-07-20）→ **2026-07-21に削除**：下書き7本を全件公開した結果`articles.js`にdraftが0件になりテストが壊れた。`draft`と`存在しないslug`は`src/router.js`（`getPublishedArticleBySlug`が両者ともnullを返す）上で同一コードパスであり、e2eレベルでの追加カバレッジは無かった。「draftが一覧・詳細に漏れない」という本質的な検証は`tests/unit/articles.test.js`のモックデータ（`selectPublished`/`findPublished`）で引き続き担保されているため、本番コンテンツの状態に依存する本テストケースのみ削除し、他5件は維持。
- [x] **10-4. `design.md`§2.2フィールド対応表に`preparation`の記載漏れ**：`preparation`（items[]/notes[]、渡航準備）の行を追加済み（2026-07-20）
- [x] **10-5. 記事本文が単一バンドルに静的importされておりコード分割なし** → ルートレベルの動的`import()`で対応（2026-07-21）。`/articles`・`/articles/:slug`を訪れたときのみ記事関連コード（`getArticles.js`・`renderArticleListPage.js`・`renderArticleDetailPage.js`・記事データを内包する`routeMeta.js`）を取得するよう`src/router.js`を変更。記事8本規模でJSON分離＋fetchは過剰設計と判断し見送り。ビルド後`dist/assets/`でメインチャンク（19.33kB）と記事チャンク（`getArticles`40.65kB等）の分離を確認、メインチャンクへの記事タイトル文字列混入ゼロを`grep`で実機確認。`npm run lint`（0エラー）・`build`（4ページ生成）・`test`（38/38）・`test:e2e`（14/14）も再検証済み
- [x] **10-6. `inbox/`写真の運用ルール未整理**：`design.md`§8.5.5に「現状の挙動」と「推奨運用」を分けて明文化（採用後の扱い・Drive側削除の非反映・自動削除しない方針）。`weekly-draft-prompt.md`にも参照を追記（2026-07-20）

### 軽微
- [x] **10-7.** 直近の週次実行ログが正しくUTF-8で追記されているか再確認 → 確認済み。`docs/pending-review.md`の2026-07-20 22:15/22:24/22:41エントリ（BOM修正後の実行分）は文字化けなく正しく描画されている
- [x] **10-8.** lint/pre-commit相当の仕組み導入 → ESLintフラット設定（`eslint.config.js`、`@eslint/js` recommendedのみ・環境別globals）＋Git pre-commitフック（`npm run lint && npm run test`、E2Eは重いため対象外）を追加（2026-07-21）。`npm run lint`（0エラー）・`npm run build`（4ページ生成）・`npm run test`（38/38）・`npm run test:e2e`（14/14）を実機で再検証済み
- [x] **10-9.** `docs/seo-keywords.md`の手作業チェックボックス管理の構造化データ移行を検討 → **結論：現時点では移行不要**（2026-07-21判断）。現状20項目・5カテゴリ・7件使用済みの規模であり、Markdownチェックボックス形式のまま人間・自動化双方が問題なく読み書きできている。移行の目安として「キーワード項目が100件を超える」「カテゴリを横断した重複検出や優先度付けなど、単純なチェックボックスでは表現できない管理が必要になる」のいずれかに該当した時点で、JSON/YAML等の構造化データへの移行を再検討する。過度な抽象化を避けるという開発標準（CLAUDE.md）に沿い、現時点での実装は見送る。

---

## Step 11. Fable再レビュー対応（2026-07-21実施）
Step 10完了後、`Agent(model:"fable")`による全体再レビューで判明した指摘事項。重大→中程度→軽微の順。

### 重大
- [x] **11-1. 本番環境（tabi-uzbekistan.com）が最新実装から大きく乖離** → 解決（2026-07-21）。原因は2つ重なっていた。
  1. **Vercelデプロイブロック**：コミット作者（`vanva <vanvan7406@gmail.com>`）がVercelプロジェクトのコントリビューターとして認識されず、「Hobby Planはprivateリポジトリでのコラボレーション非対応」でずっとブロックされていた（`ea2bc7f`以降、全push）。リポジトリをPublic化した上で、git commit authorをVercelプロジェクトオーナーのメール（`d.b.works0102@gmail.com`）に変更（`git config --local user.email`）して再pushしたところブロック解除・デプロイ成功（コミット`78cd86a`）。
  2. **`vercel.json`に`cleanUrls`が無かった**：ブロック解除後も`/about`・`/articles`が200を返すもののtitleがトップページと同一という新たな不具合が判明。Vercelは`cleanUrls: true`が無いと拡張子なしパス（`/about`）を`about.html`へ自動解決しないため、`prerender-meta.js`が生成した`dist/about.html`等が使われずSPAフォールバックの`index.html`が返っていた。ローカル`vite preview`（sirv）は拡張子なしパスを自動解決するため、この差はローカル検証だけでは発見できなかった（11-5の指摘通り）。`vercel.json`に`"cleanUrls": true`を追加（コミット`e3e2714`）して解決。
  - **最終確認（curl実機、2026-07-21）**：`/`・`/about`・`/articles`・`/articles/uzbekistan-11days-highlights`すべてHTTP 200＋ルートごとに正しい一意のtitleを返すことを確認済み。
- [ ] **11-2. `src/router.js`のPromise化に伴うナビゲーションのレース条件**：Step 10-5で`render()`/`resolve()`が非同期化されたが、進行中ナビゲーションをキャンセルする仕組み（トークン等）がない。解決速度の異なるルート間（例：未取得の記事チャンクを要する`/articles/xxx`→直後に読み込み済みの`/about`）を連続でクリックすると、後発のrenderが先に完了し、URLと画面/メタの不整合が起こり得る。対応するE2Eテストなし。

### 中程度
- [ ] **11-3. 静的ルート一覧の二重管理（DRY違反）**：`scripts/generate-sitemap.js`の`STATIC_ROUTES`と`src/core/routeMeta.js`の`getPrerenderPaths()`内`staticPaths`が同一内容を独立にハードコード。
- [ ] **11-4. `routeMeta.js`/`prerender-meta.js`にユニットテストが無い**：SEOの中核ロジックだがテストの穴。
- [x] **11-5. 本番デプロイの検証がローカル`vite preview`（sirv）止まり** → 11-1の対応中に実例として顕在化（cleanUrls問題はローカルでは再現しなかった）。今後の運用ルールとして明文化：コード変更のデプロイ後は必ず`curl`等で本番URLを直接確認し、「ローカルbuild確認」と「本番デプロイ後の確認」を別工程として扱う。
- [ ] **11-6. `buildCountryMeta`のデッドコード化**：`src/utils/meta.js`内、実装から到達しない（`routeMeta.js`は`buildMeta`を直接使用）。誤った`/${country.id}`URLを生成するdead code。

### 軽微
- [ ] **11-7.** `src/utils/dom.js`の`el()`の`html:`キー（innerHTML代入）が未使用。将来のXSS導線になり得るため、不要なら削除・使うならサニタイズ責任を明記。

---

## 将来拡張（スコープ外）
- [ ] キルギス／カザフスタン等は本サイトへ追加せず、独立した別サイトとして検討
- [ ] 多言語対応・アフィリエイト等の収益化検討
