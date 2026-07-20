# 設計書 — 中央アジア観光サイト（central-asia-guide）

本書は `docs/requirements.md` に基づく設計を定義する。実装はまだ行わず、方針とインターフェースを確定させることを目的とする。

---

## 1. サイト構成（ページ一覧とURL構造）

MVPでは以下のページを提供する。国の追加は `src/data/` にデータファイルを追加するだけで拡張できる設計とする。

| ページ | URL | 概要 |
|--------|-----|------|
| トップページ | `/` | サイト紹介・国選択（ウズベキスタン／キルギス） |
| ウズベキスタン国別ページ | `/uzbekistan` | 概要・治安・ビザ・モデルコース・観光地など |
| キルギス国別ページ | `/kyrgyzstan` | 同上 |
| サイトについて／お問い合わせ | `/about` | サイトの目的・運営情報・簡易お問い合わせ導線 |
| 404 | `/*`（未定義パス） | 未定義URLのフォールバック |

### 将来拡張
- `/kazakhstan`, `/tajikistan`, `/turkmenistan` を同一テンプレート・同一データ構造で追加可能とする。
- ページ追加時にコードを変更せず、データ追加＋ルート定義追加のみで完結することを目標にする。

---

## 2. データ設計（国別コンテンツ）

国別コンテンツは `src/data/` 配下に **1国1ファイル**（例: `uzbekistan.js`, `kyrgyzstan.js`）でオブジェクトとして定義し、`src/data/index.js` で集約してエクスポートする。

### 2.1 国データのスキーマ

```js
// src/data/uzbekistan.js（型イメージ）
export default {
  id: "uzbekistan",              // URLスラッグ兼一意キー
  name: "ウズベキスタン",          // 表示名
  nameEn: "Uzbekistan",          // 英語名（OGP・構造化データ用）
  tagline: "青の都サマルカンドとシルクロードの至宝", // トップページ用キャッチ
  heroImage: "/images/uzbekistan/hero.jpg",
  overview: "中央アジアの中心に位置し…",  // 国の概要（文章）

  // 基本情報（テーブル表示）
  basicInfo: {
    language: "ウズベク語・ロシア語",
    currency: "スム（UZS）",       // ※ currency フィールド
    timezone: "UTC+5",            // ※ timezone フィールド
    visa: "30日以内の観光はビザ不要", // ※ visa フィールド
  },

  safety: {                       // ※ safety フィールド
    level: "比較的安全",
    summary: "治安は良好だが…",
    notes: ["スリに注意", "夜間の一人歩きは避ける"],
  },

  currency: {                     // 費用感の補足（為替目安など）
    code: "UZS",
    roughRate: "1円 ≒ 90スム（目安）",
  },

  bestSeason: {                   // ※ bestSeason フィールド
    recommended: "4〜5月・9〜10月",
    reason: "気候が穏やかで観光に最適",
  },

  budget: {                       // ※ budget フィールド
    daily: "1日 5,000〜12,000円",
    breakdown: [
      { item: "宿泊", cost: "2,000〜6,000円" },
      { item: "食事", cost: "1,000〜3,000円" },
    ],
  },

  preparation: {                  // 渡航準備
    items: ["パスポート残存期間の確認", "現金（USD）の準備"],
    notes: ["両替はホテルや銀行で"],
  },

  // ※ modelCourses[] フィールド
  modelCourses: [
    {
      id: "uz-3days",
      title: "サマルカンド集中3日間",
      days: 3,
      summary: "世界遺産サマルカンドを堪能する短期プラン",
      itinerary: [
        { day: 1, title: "レギスタン広場", detail: "…" },
        { day: 2, title: "シャーヒ・ズィンダ廟群", detail: "…" },
        { day: 3, title: "グーリ・アミール廟", detail: "…" },
      ],
    },
  ],

  // ※ attractions[] フィールド
  attractions: [
    {
      id: "registan",
      name: "レギスタン広場",
      city: "サマルカンド",
      image: "/images/uzbekistan/registan.jpg",
      description: "3つのメドレセに囲まれた…",
      dominantColor: "#1b6ca8", // objectFit:container時の背景色（画像背景色ルール準拠）
    },
  ],
};
```

### 2.2 フィールド一覧（要件との対応）

| フィールド | 型 | 要件対応 |
|-----------|----|---------|
| `id` | string | URLスラッグ・一意キー |
| `name` / `nameEn` | string | 表示名・SEO用 |
| `overview` | string | 国の概要 |
| `basicInfo`（language/currency/timezone/visa） | object | 基本情報 |
| `safety` | object | 治安・安全情報 |
| `visa` | `basicInfo.visa` | ビザ情報 |
| `currency` | object | 通貨・為替 |
| `timezone` | `basicInfo.timezone` | 時差 |
| `bestSeason` | object | ベストシーズン |
| `budget` | object | 費用感 |
| `modelCourses[]` | array | おすすめモデルコース |
| `attractions[]` | array | 主要観光地 |

### 2.3 データの原則
- **DRY**：共通の型・表示ラベルは `src/utils/` の定数として一元管理する。
- **バリデーション**：`core/` で必須フィールドの存在チェックを行い、欠損時は安全にフォールバック表示する。
- **画像背景色**：`objectFit: contain` を使う画像には各 `attraction.dominantColor` を背景色に設定する（メモリ「画像背景色ルール」準拠）。

---

## 3. ディレクトリ構成

```
central-asia-guide/
├── index.html            # エントリHTML（メタタグ・OGPのベース）
├── package.json
├── vite.config.js
├── public/
│   └── images/           # 国別の画像アセット
├── src/
│   ├── main.js           # アプリ初期化・ルーター起動
│   ├── router.js         # 簡易ルーティング（後述）
│   ├── data/             # 国別データ
│   │   ├── index.js      # 全国データの集約・エクスポート
│   │   ├── uzbekistan.js
│   │   └── kyrgyzstan.js
│   ├── core/             # ビジネスロジック（データ取得・整形）
│   │   ├── getCountryData.js
│   │   ├── getAllCountries.js
│   │   └── validateCountry.js
│   ├── ui/               # 画面描画・DOM操作
│   │   ├── renderTopPage.js
│   │   ├── renderCountryPage.js
│   │   ├── renderAboutPage.js
│   │   ├── renderNotFound.js
│   │   └── components/   # 再利用描画関数
│   │       ├── renderHeader.js
│   │       ├── renderFooter.js
│   │       ├── renderCountryCard.js
│   │       ├── renderModelCourse.js
│   │       └── renderAttraction.js
│   └── utils/            # 汎用ユーティリティ
│       ├── dom.js        # createElement等のDOMヘルパー
│       ├── meta.js       # メタタグ・OGP・構造化データ更新
│       └── labels.js     # 表示ラベル定数
├── tests/
│   ├── unit/             # Vitest
│   └── e2e/              # Playwright
└── docs/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

---

## 4. コンポーネント／モジュール分割方針

**単一責任・DRY** を徹底し、レイヤーを明確に分離する。

### レイヤー責務
- **data/**：純粋なデータのみ。ロジックを持たない。
- **core/**：データ取得・整形・検証。DOMに依存しない（＝ユニットテスト対象）。
  - `getCountryData(id)`：IDから国データを取得。未存在なら `null`。
  - `getAllCountries()`：トップページ用の一覧（id/name/tagline/heroImage）を返す。
  - `validateCountry(data)`：必須フィールド検証。boolean＋不足フィールド一覧を返す。
- **ui/**：受け取ったデータをDOMに描画する純粋な描画関数。副作用はDOM生成のみ。
  - `renderTopPage(countries)` / `renderCountryPage(country)` / `renderAboutPage()` / `renderNotFound()`。
  - `components/` はページ間で再利用する部品（ヘッダー・フッター・カード・モデルコース・観光地）。
- **utils/**：DOMヘルパー・メタタグ更新・ラベル定数など汎用処理。

### 依存方向
```
main.js → router.js → ui/* → core/* → data/*
                      ui/* → utils/*
```
上位が下位に依存する一方向。`core` は `ui` を知らない（テスト容易性）。

---

## 5. ルーティング方針

**判断：軽量なクライアントサイド・ルーター（History APIベースの簡易SPA）を採用する。**

- 理由：ページ構造がほぼ同一（国別ページはデータ違いのみ）でDRYに描画関数を再利用でき、国追加がデータ追加だけで済むため。ページ遷移も高速でLighthouseスコアに有利。
- 実装方針：`src/router.js` にパス→描画関数のマッピングを定義。`history.pushState` ＋ `popstate` で遷移し、内部リンクは委譲クリックハンドラで処理する。
- ルート定義（イメージ）：
  ```
  "/"            → renderTopPage
  "/:countryId"  → renderCountryPage（getCountryData で解決、無ければ 404）
  "/about"       → renderAboutPage
  "*"            → renderNotFound
  ```
- **SEO配慮**：SPAだがVercelの rewrite で全パスを `index.html` に返し、各遷移で `utils/meta.js` により `<title>`・メタ・OGP・構造化データを動的更新する。Lighthouse/クローラ対策として、必要に応じ将来的にプリレンダリング（vite-plugin-ssg等）を検討する余地を残す。
- Vercel設定：`vercel.json` に SPA fallback（`rewrites`: すべて `/index.html`）を定義。

---

## 6. レスポンシブ・SEO対応方針

### レスポンシブ（スマートフォン優先）
- モバイルファーストでCSSを記述。
- ブレークポイント：
  | 名称 | 幅 |
  |------|----|
  | モバイル（基準） | 〜599px |
  | タブレット | 600px〜1023px |
  | デスクトップ | 1024px〜 |
- 画像は `max-width: 100%` ＋遅延読み込み（`loading="lazy"`）。`objectFit: contain` 時は支配色背景（メモリ準拠）。

### SEO
- `index.html` に基本メタタグ（title, description, viewport, charset）。
- 各ページ遷移時に `utils/meta.js` で以下を動的更新：
  - `<title>` / `<meta name="description">`
  - OGP（`og:title`, `og:description`, `og:image`, `og:url`, `og:type`）
  - Twitter Card（`summary_large_image`）
- 構造化データ（JSON-LD）：国別ページは `TouristDestination` / `Article` 相当を出力。
- アクセシビリティ：全画像に `alt`、十分なコントラスト比、見出し階層（h1→h2→h3）の適正化。

---

## 7. テスト方針

### 7.1 ユニットテスト（Vitest）
DOM非依存の `core/` と `utils/` を中心にテストする。

| 対象 | テスト内容 |
|------|-----------|
| `core/getCountryData` | 存在するIDでデータを返す／未存在で `null` を返す |
| `core/getAllCountries` | 全国分の一覧を返す・必要フィールドを含む |
| `core/validateCountry` | 必須フィールド欠損を検出・不足一覧を返す |
| `utils/meta` | 与えたデータからtitle/OGP/JSON-LDを正しく生成 |
| `utils/labels` | ラベル定数の整合性 |
| `data/*`（データ整合性） | 各国データが `validateCountry` を通過する |

軽量な描画関数（`components/*`）は jsdom 上で「与えたデータから期待するDOM構造を返すか」を必要に応じてテストする。

### 7.2 E2Eテスト（Playwright MCP）
| シナリオ | 内容 |
|---------|------|
| トップ→国別遷移 | トップで「ウズベキスタン」を選択→ `/uzbekistan` に遷移し概要が表示される |
| 国別ページ表示 | 基本情報・治安・ビザ・費用感が表示される |
| モデルコース表示 | モデルコースの日程（itinerary）が展開表示される |
| 観光地表示 | 主要観光地カードが画像・alt付きで表示される |
| ナビゲーション | ヘッダーからトップ／Aboutへ遷移できる・ブラウザ戻るが機能する |
| 404 | 未定義URLで404ページが表示される |
| レスポンシブ | モバイルビューポートでレイアウトが崩れない |

---

## 8. デプロイ方針

要件（`requirements.md` §7・§10）に準拠する。

1. **ビルド**：`npm run build`（Vite）でビルドエラーゼロを確認（開発標準：ビルドエラーゼロ）。
2. **E2E最終確認**：Playwrightでmainシナリオが通ることを確認。
3. **Google Driveバックアップ**：`gdrive:dev/central-asia-guide` へ差分同期（rclone等）。
4. **Vercelデプロイ**：Vite静的サイトとしてVercelにデプロイ。`vercel.json` に SPA fallback（rewrites）を設定。
5. デプロイ後、本番URLでLighthouse（パフォーマンス90以上目標）とOGP表示を確認。

---

## 9. 設計上の原則まとめ
- **拡張性**：国追加は「データファイル追加」で完結（コード変更不要）。
- **DRY・単一責任**：レイヤー分離（data / core / ui / utils）を厳守。
- **テスト容易性**：ロジックはDOM非依存に隔離しVitestで担保。
- **メモリ準拠**：画像背景色ルール・確認不要ルール・開発標準（ドキュメントファースト／TDD／ビルドエラーゼロ）を反映。
