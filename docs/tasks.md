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
- [ ] ESLint/Prettier など基本整備（任意項目のため未着手。Step 10-9参照）

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
- [ ] **OGP/メタタグ/構造化データが各ページで正しく出力されるか確認 → 未達を確認（重大）**：`npm run preview`後にJS非実行で`curl`取得した結果、記事詳細URL（例:`/articles/samarkand-registan-square-highlights`）でも`<title>`/`og:title`/`og:url`がトップページ用の汎用値のままで、記事別メタ（`buildArticleMeta`）が反映されていないことを実機で確認した（2026-07-20）。原因と対策はStep 10-1参照。

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
- [ ] **10-1. SPAのCSRにより記事別OGP/構造化データがJS非実行のスクレイパー（SNSシェア等）に反映されない**：`npm run preview`後の`curl`実機検証で未達を確認済み（Step 7参照）。対策候補：プリレンダリング（`vite-plugin-ssg`等）またはビルド時のルート別静的HTML生成の導入
- [ ] **10-2. 週次自動化の「対象外ファイル改変禁止」「1本のみ生成」制約が技術的に未強制**：`--allowedTools`はツール種別のみ制限しパス制限がない。対策：`weekly-draft.ps1`実行後に`git diff --name-only`を取得し、`src/data/articles.js`・`docs/seo-keywords.md`以外の変更があれば警告/中断する後処理チェックを追加

### 中程度
- [ ] **10-3. `tests/e2e/articles.spec.js`が実在するdraft記事での直接アクセス404を検証していない**（架空slugのみテスト対象）。実在slug（例:`samarkand-registan-square-highlights`）を使ったケースを追加
- [ ] **10-4. `design.md`§2.2フィールド対応表に`preparation`の記載漏れ**（実装・スキーマ例には存在、対応表のみ抜け）
- [ ] **10-5. 記事本文が単一バンドルに静的importされておりコード分割なし**：記事数が数十本規模になった際のバンドル肥大化・パフォーマンス劣化リスク。対策候補：記事本文のJSON分離＋動的fetch、またはルート単位の`import()`
- [ ] **10-6. `inbox/`写真の運用ルール未整理**：採用後の移動、Drive側削除時の扱い、未使用候補のクリーンアップ方針を明文化

### 軽微
- [ ] **10-7.** 直近の週次実行ログが正しくUTF-8で追記されているか再確認（過去に文字化けが発生していた形跡があるため）
- [ ] **10-8.** lint/pre-commit相当の仕組み導入（Step 2の任意ESLint整備と合わせて検討）
- [ ] **10-9.** `docs/seo-keywords.md`の手作業チェックボックス管理を、キーワード数が大きく増えた場合に構造化データへ移行する余地の検討

---

## 将来拡張（スコープ外）
- [ ] キルギス／カザフスタン等は本サイトへ追加せず、独立した別サイトとして検討
- [ ] 多言語対応・アフィリエイト等の収益化検討
