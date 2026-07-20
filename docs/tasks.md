# タスクリスト — 中央アジア観光サイト（central-asia-guide）

`docs/design.md` を実装可能な粒度に分解したタスク一覧。開発標準のフロー（Step1〜8）に沿った順序で記載する。
上から順に着手し、各ステップ完了時にチェックを入れる。

---

## Step 1. ドキュメント作成
- [x] requirements.md 作成
- [x] design.md 作成
- [x] tasks.md 作成
- [ ] 3ドキュメントの内容整合性を最終レビュー

## Step 2. 環境構築・プロジェクト初期化
- [ ] Vite プロジェクト初期化（vanilla JS）
- [ ] `package.json` にスクリプト定義（dev / build / preview / test / test:e2e）
- [ ] Vitest 導入・設定（`vitest.config` / jsdom 環境）
- [ ] Playwright 導入・設定（`playwright.config`）
- [ ] ディレクトリ構成を design.md 準拠で作成（src/data・core・ui・utils, tests/unit・e2e, public/images）
- [ ] `index.html` の骨組み（基本メタタグ・viewport・charset・ルートコンテナ）
- [ ] ESLint/Prettier など基本整備（任意）

## Step 3. テスト先行（Red）— ユニット
- [ ] `tests/unit/getCountryData.test.js`（存在ID→データ／未存在→null）
- [ ] `tests/unit/getAllCountries.test.js`（全国一覧・必要フィールド）
- [ ] `tests/unit/validateCountry.test.js`（必須欠損検出・不足一覧）
- [ ] `tests/unit/meta.test.js`（title/OGP/JSON-LD生成）
- [ ] `tests/unit/labels.test.js`（ラベル定数整合）
- [ ] `tests/unit/dataIntegrity.test.js`（各国データが validateCountry を通過）
- [ ] この時点で全テストが Red（失敗）であることを確認

## Step 4. 実装（Green）
### 4-1. データ層
- [ ] `src/utils/labels.js`（表示ラベル定数）
- [ ] `src/data/uzbekistan.js`（design.md スキーマ準拠：id/name/overview/basicInfo/safety/currency/bestSeason/budget/preparation/modelCourses/attractions）
- [ ] `src/data/kyrgyzstan.js`（同上）
- [ ] `src/data/index.js`（全国データ集約・エクスポート）
### 4-2. コアロジック
- [ ] `src/core/validateCountry.js`
- [ ] `src/core/getCountryData.js`
- [ ] `src/core/getAllCountries.js`
### 4-3. ユーティリティ
- [ ] `src/utils/dom.js`（createElement 等 DOM ヘルパー）
- [ ] `src/utils/meta.js`（メタ・OGP・JSON-LD 更新）
### 4-4. UI 描画層
- [ ] `src/ui/components/renderHeader.js`
- [ ] `src/ui/components/renderFooter.js`
- [ ] `src/ui/components/renderCountryCard.js`
- [ ] `src/ui/components/renderModelCourse.js`
- [ ] `src/ui/components/renderAttraction.js`（objectFit:contain時 dominantColor 背景）
- [ ] `src/ui/renderTopPage.js`（国選択・サイト紹介）
- [ ] `src/ui/renderCountryPage.js`（概要・治安・ビザ・費用・モデルコース・観光地）
- [ ] `src/ui/renderAboutPage.js`
- [ ] `src/ui/renderNotFound.js`
### 4-5. ルーティング・初期化
- [ ] `src/router.js`（History APIベース簡易ルーター：/・/:countryId・/about・*）
- [ ] `src/main.js`（初期化・ルーター起動・内部リンク委譲）
- [ ] CSS（モバイルファースト・ブレークポイント 600/1024px・レスポンシブ画像）
- [ ] ユニットテストが全て Green になることを確認

## Step 5. リファクタリング（Refactor）
- [ ] 重複コードの共通化（DRY）・命名整理
- [ ] レイヤー依存方向の確認（core が ui に依存していないこと）
- [ ] マジックナンバー・文字列の定数化
- [ ] リファクタ後もユニットテストが Green であることを確認

## Step 6. E2Eテスト（Playwright MCP）
- [ ] `tests/e2e/topToCountry.spec`（トップ→ウズベキスタン遷移で概要表示）
- [ ] `tests/e2e/countryPage.spec`（基本情報・治安・ビザ・費用感の表示）
- [ ] `tests/e2e/modelCourse.spec`（モデルコースの日程表示）
- [ ] `tests/e2e/attractions.spec`（観光地カード・alt付き画像）
- [ ] `tests/e2e/navigation.spec`（ヘッダー遷移・ブラウザ戻る）
- [ ] `tests/e2e/notFound.spec`（未定義URLで404）
- [ ] `tests/e2e/responsive.spec`（モバイルビューポートで崩れなし）
- [ ] 全E2Eシナリオが通ることを確認

## Step 7. ビルド確認
- [ ] `npm run build` でビルドエラーゼロを確認
- [ ] `npm run preview` で本番ビルドの表示確認
- [ ] Lighthouse でパフォーマンス90以上・SEO・アクセシビリティを確認
- [ ] OGP/メタタグ/構造化データが各ページで正しく出力されるか確認

## Step 8. バックアップ・デプロイ
- [ ] Google Drive `gdrive:dev/central-asia-guide` へ差分バックアップ
- [ ] `vercel.json`（SPA fallback rewrites）を作成
- [ ] Vercel へデプロイ
- [ ] 本番URLで表示・遷移・OGP・Lighthouse を最終確認

---

## 将来拡張（MVP後・スコープ外）
- [ ] カザフスタン／タジキスタン／トルクメニスタンのデータ追加
- [ ] 多言語対応・アフィリエイト等の収益化検討
