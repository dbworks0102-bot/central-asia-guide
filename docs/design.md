# 設計書 — ウズベキスタン旅行ガイド（central-asia-guide）

本書は `docs/requirements.md` に基づく設計を定義する。

> 注記：当初は複数国（ウズベキスタン・キルギス）メディアとして設計したが、
> **ウズベキスタン専門サイト**へ方針転換した。本書は転換後の単一国アーキテクチャを記載する。

---

## 1. サイト構成（ページ一覧とURL構造）

ウズベキスタン専門サイトとして以下のページを提供する。トップページ `/` がウズベキスタンの
ガイド本体であり、国選択のステップは持たない。

| ページ | URL | 概要 |
|--------|-----|------|
| トップページ（ウズベキスタンガイド） | `/` | 概要・治安・ビザ・モデルコース・観光地など、ウズベキスタンのガイド本体 |
| サイトについて／お問い合わせ | `/about` | サイトの目的・運営情報・簡易お問い合わせ導線 |
| 404 | `/*`（未定義パス） | 未定義URLのフォールバック |

### 他国について
- キルギス等の他中央アジア諸国は本サイトの対象外。
- 拡張する場合は本サイトへ組み込まず、独立した別サイトとして構築する方針とする。

---

## 2. データ設計（国コンテンツ）

コンテンツは `src/data/uzbekistan.js` に純粋なオブジェクトとして定義し、`src/data/index.js` で
集約してエクスポートする（`countries` は単一国の配列 `[uzbekistan]`）。データ層と描画層を
分離しておくことで、将来モデルコースや観光地の追加・差し替えを容易にする。

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
| `preparation`（items[]/notes[]） | object | 渡航準備（持ち物・事前手続きの `items` と補足 `notes`） |
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
│   ├── data/             # 国データ
│   │   ├── index.js      # データの集約・エクスポート（countries = [uzbekistan]）
│   │   └── uzbekistan.js
│   ├── core/             # ビジネスロジック（データ取得・整形）
│   │   ├── getCountryData.js
│   │   ├── getAllCountries.js
│   │   └── validateCountry.js
│   ├── ui/               # 画面描画・DOM操作
│   │   ├── renderCountryPage.js  # トップ（/）で使用するウズベキスタンのガイド本体
│   │   ├── renderAboutPage.js
│   │   ├── renderNotFound.js
│   │   └── components/   # 再利用描画関数
│   │       ├── renderHeader.js
│   │       ├── renderFooter.js
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
  - `getAllCountries()`：データ整合性チェック用に対象国の一覧（id/name/tagline/heroImage）を返す。
  - `validateCountry(data)`：必須フィールド検証。boolean＋不足フィールド一覧を返す。
- **ui/**：受け取ったデータをDOMに描画する純粋な描画関数。副作用はDOM生成のみ。
  - `renderCountryPage(country)` / `renderAboutPage()` / `renderNotFound()`。トップ `/` は
    `renderCountryPage` にウズベキスタンのデータを渡して描画する。
  - `components/` はページ間で再利用する部品（ヘッダー・フッター・モデルコース・観光地）。
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

- 理由：About・404 を含む数ページを高速に切り替えられ、Lighthouseスコアに有利。SPA構成のまま
  ページごとにメタ・OGP・構造化データを動的更新できる。
- 実装方針：`src/router.js` にパス→描画関数のマッピングを定義。`history.pushState` ＋ `popstate` で遷移し、内部リンクは委譲クリックハンドラで処理する。
- ルート定義：
  ```
  "/"       → renderCountryPage（ウズベキスタンのデータを getCountryData で取得）
  "/about"  → renderAboutPage
  "*"       → renderNotFound
  ```
- 単一国サイトのため `/:countryId` のような動的ルートは持たない（`/uzbekistan` 等は 404）。
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
| `core/getCountryData` | 存在するID（uzbekistan）でデータを返す／未存在（削除済みkyrgyzstan含む）で `null` を返す |
| `core/getAllCountries` | 対象国（ウズベキスタンのみ）の一覧を返す・必要フィールドを含む |
| `core/validateCountry` | 必須フィールド欠損を検出・不足一覧を返す |
| `utils/meta` | 与えたデータからtitle/OGP/JSON-LDを正しく生成 |
| `utils/labels` | ラベル定数の整合性 |
| `data/*`（データ整合性） | ウズベキスタンのデータが `validateCountry` を通過する |

軽量な描画関数（`components/*`）は jsdom 上で「与えたデータから期待するDOM構造を返すか」を必要に応じてテストする。

### 7.2 E2Eテスト（Playwright MCP）
| シナリオ | 内容 |
|---------|------|
| トップページ表示 | `/` にウズベキスタンの概要・基本情報・治安・ビザ・費用感が表示される |
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

## 8.5. 記事システム（SEOコラム）設計

`requirements.md` §9.5 に基づく記事システムの設計。既存レイヤー（data / core / ui / utils）を踏襲する。

### 8.5.1 ルーティング（§1 に追加）

| ページ | URL | 概要 |
|--------|-----|------|
| コラム一覧 | `/articles` | `status === "published"` の記事のみを `publishDate` 降順で表示 |
| コラム詳細 | `/articles/:slug` | 該当記事が **published のときのみ**表示。draft・未存在は 404 にフォールバック |

- ルーティングは `src/router.js` に追加。`/articles/:slug` は正規表現 `^/articles/([^/]+)/?$` で解決する。
- **公開判定は必ず core 層（`getArticles.js`）で行い**、router/ui は published 済みデータのみを受け取る。
  下書きが一覧・詳細・sitemap のどこにも漏れないことを単一箇所で担保する。

### 8.5.2 データ設計（`src/data/articles.js`）

記事は配列としてエクスポートする純粋データ。`body` は既存の DOM ヘルパー描画に合わせたブロック配列。

```js
{
  slug: "uzbekistan-11days-highlights", // URL用一意文字列
  title, description,                    // meta / OGP 用
  keywords: ["…"],                       // SEOキーワード軸の記録
  heroImage: "/images/uzbekistan/hero.jpg", // 既存の実写真のみ
  publishDate: "2026-07-15",             // ISO日付（YYYY-MM-DD）
  status: "published",                   // "draft" | "published"
  body: [                                 // ブロック配列
    { type: "heading",   text: "…" },
    { type: "paragraph", text: "…" },
    { type: "list",      items: ["…"] },
  ],
  relatedLinks: [{ label: "…", url: "/" }], // 任意。サイト内部リンク導線
}
```

### 8.5.3 モジュール分割

- **core/getArticles.js**：`selectPublished(list)`（published 抽出＋降順ソート・純粋関数）／
  `findPublished(list, slug)`（published のみ返す・純粋関数）と、実データ用ラッパ
  `getPublishedArticles()` / `getPublishedArticleBySlug(slug)`。DOM非依存でユニットテスト対象。
- **ui/renderArticleListPage.js / renderArticleDetailPage.js**：描画のみ。詳細は body ブロックを
  `heading/paragraph/list` に対応づけて描画し、`relatedLinks` を `data-link` 内部リンクとして出力する。
- **utils/meta.js**：`buildArticleMeta(article)`（type:"article"）／`buildArticleJsonLd(article)`
  （`@type:"Article"`、headline / datePublished / image（絶対URL）/ author=Organization）。
- **utils/formatDate.js**：ISO日付を日本語表記（YYYY年M月D日）に整形する小ヘルパー。

### 8.5.4 sitemap.xml 自動生成

- `scripts/generate-sitemap.js`（Node実行）が **published 記事＋静的ルート（/・/about・/articles）** を
  対象に絶対URLで `public/sitemap.xml` を生成する。公開判定は core の `getPublishedArticles()` を再利用。
- `package.json` の `prebuild` で `build` 前に自動実行。`public/robots.txt` に `Sitemap:` 行を追記。

### 8.5.5 写真inbox（`public/images/uzbekistan/inbox/`）の運用ルール

週次の記事下書き自動生成パイプライン（`scripts/weekly-draft.ps1`）は、実行のたびに rclone で
Google Drive の指定フォルダから `public/images/uzbekistan/inbox/` へ写真を**一方向 pull**する
（`rclone copy`。新規・更新ファイルの取り込みのみで、ローカルからの削除は行わない）。取り込まれた写真は
`heroImage` 候補が増えるだけで、記事本文への採用可否の判断はしない（採用判断は後段の claude と人間レビューに委ねる）。
以下は運用ポリシーの明文化であり、**現状の挙動**（実装がそう振る舞う事実）と**推奨運用**（人間が守る方針）を分けて記す。

#### 1. 採用後（`heroImage` 等に使われた後）の写真の扱い

- **現状の挙動**：採用の有無にかかわらず、取り込んだ写真は `inbox/` 内に残り続ける。採用済みかどうかを
  記録・移動する仕組みは実装にない。`heroImage` は `inbox/` 内のパスをそのまま参照できるため、採用後も
  ファイルは同じ場所に置かれたままで問題なく表示される。
- **推奨運用**：採用済みと分かった写真は、`public/images/uzbekistan/` 直下（`inbox/` の外）へ手動で移し、
  内容の分かるファイル名にリネームしたうえで `heroImage` の参照先も更新することを推奨する。こうすると
  `inbox/` を「まだ採用判断していない新着候補だけ」の状態に保て、次回以降のレビュー対象を絞り込める。
  ※この移動・リネームは人間が行う運用作業であり、パイプラインは自動では行わない。
- **実施例（2026-07-26）**：ヒヴァの採用済み8枚はリネーム後の作業用コピーが `public/images/uzbekistan/` 直下に
  既に存在し、`inbox/khiva/` 側には無加工のオリジナル（`PXL_*.jpg`）がハッシュ完全一致のまま重複して残っていた。
  これらはファイル名（`PXL_*.jpg`）のままでは内容が分からないため、直下へは置かず
  `public/images/uzbekistan/adopted-originals/<city>/` へ退避する運用とした（`inbox/` の「未採用候補のみ」
  という趣旨は維持しつつ、無加工オリジナルの保管場所を分離）。ブハラ2枚・サマルカンド11枚は採用時にリサイズ／
  加工されておりハッシュが一致しないため、機械的な元ファイル特定はできず、`inbox/` 内に残したまま（削除・移動なし）。

#### 2. Google Drive 側でユーザーが写真を削除した場合

- **現状の挙動**：ローカルの `inbox/` には**反映されない**。取り込みは `rclone copy`（`sync` ではない）による
  一方向 pull のため、Google Drive から写真を削除しても、既にローカルへ取り込まれた同名ファイルは削除されず
  `inbox/` に残る。したがって Google Drive 側の削除だけでローカルの候補写真を消すことはできない。
- **推奨運用**：ローカルから確実に外したい写真は、`inbox/` 内のファイルを直接削除する。誤取り込みや
  公開に不適切な写真に気づいた場合も同様に、ローカル側で手動削除する。

#### 3. 一定期間使われなかった候補写真のクリーンアップ

- **現状の挙動**：`inbox/` 内の写真を古さや未使用期間で自動削除する仕組みは**ない**。取り込まれた写真は
  人間が手動で削除・移動しない限り、そのまま蓄積し続ける。
- **推奨運用**：クリーンアップは安全側に倒し、**自動削除はしない**。長期間 `heroImage` に採用されない候補が
  溜まってきた場合は、人間が内容を確認したうえで、`inbox/` からの手動削除、または採用予定として `inbox/` 外へ
  退避のいずれかを判断する。誤って必要な写真を消さないよう、削除前には Google Drive 側にオリジナルが残っているか
  確認することが望ましい。

#### 8.5.6 3日ローテーション自動公開（`scripts/auto-publish.mjs` / `scripts/auto-publish.ps1`）

148件のdraft記事レビュー（2026-07-27実施）後、ユーザーの明示判断（`AskUserQuestion`回答）により、
**148件を作成順（`src/data/articles.js`の出現順）に3日1本、人間の確認なしで完全自動公開する**運用を導入した。
これは§8.5.5に隣接する自動化だが、週次下書き生成とは独立した別パイプラインである。

- **選定ロジック**：`publishNextDraft(sourceText, skipSlugs, today)`（純粋関数）が、`articles.js`をスラッグ出現順に走査し、
  `SKIP_SLUGS`に含まれず`status:"draft"`である最初の記事1件を選ぶ。該当ブロックの`publishDate`と`status`のみを
  文字列置換で書き換え、他記事・コメント・フォーマットは一切変更しない。対象なしは`null`（CLIでは`"NONE"`）を返す。
- **除外リスト**：`SKIP_SLUGS`は現在`["khiva-taxi-app-transport-highlights"]`のみ（`docs/pending-review.md`
  「2026-07-27 大規模レビュー」で東門の名称誤り＝要修正と判定された記事）。本文修正後にリストから外せば
  通常どおりローテーションへ復帰する。他の軽微な指摘（文字数不足・hero画像の重複・表現の重複等）は
  ユーザー判断により公開をブロックする理由としない。
- **完全自動の範囲**：`auto-publish.ps1`が`node scripts/auto-publish.mjs`実行→`npm run lint`/`test`/`build`を
  ゲートとして通過→`git add src/data/articles.js`・`git commit`・`git push`まで、人間の確認を挟まず実行する。
  いずれかのゲートで失敗した場合のみ`git checkout -- src/data/articles.js`で変更を破棄し、commit/pushは行わない。
  成功・失敗いずれも`docs/publish-log.md`にタイムスタンプ付きで追記する。
- **方針転換の位置づけ**：以前の運用（週次下書き生成→`docs/pending-review.md`へ集約→人間レビュー→手動published化）は
  下書き生成そのものには引き続き使うが、**published化の最終判断を人間が行うという前提はこの機能に限り明示的に撤回**されている。
  これはメモリの恒常方針ではなく、2026-07-27のこの会話内でのユーザーの個別判断として記録する。

#### 8.5.7 週次アクセス解析＋自動SEO改善（`scripts/fetch-search-console-data.mjs` / `scripts/weekly-seo-prompt.md` / `scripts/weekly-seo.ps1`）

ユーザー要望「週に一度アクセス解析を行って、SEO対策やサイト構成について自動で改善させていって」（2026-07-27）を受けて
導入。`AskUserQuestion`で解析基盤とし**Google Search Console**を選択、改善適用は§8.5.6（3日ローテーション自動公開）と
同じく**完全自動（人間の確認なし）**という方針が決定した。既存の週次下書き生成（`weekly-draft.ps1`、人間レビュー前提）
とは独立した別パイプラインだが、キーワード機会の受け渡しで両者は連携する。

- **データ取得**：`scripts/fetch-search-console-data.mjs`がサービスアカウント認証（`google-auth-library`）で
  Search Console API（`searchAnalytics.query`）を呼び出し、直近28日分（直近3日は未確定データのため除外）の
  page別・query別データを取得する。純粋関数`summarizeSearchConsoleData(pageRows, queryRows)`が
  「掲載回数20以上かつCTR2%未満の低CTRページ上位10件」「掲載回数10以上かつ平均掲載順位10位以下（2ページ目以降）の
  キーワード上位15件」を抽出し、`scripts/.seo-data/latest.json`に保存する（この関数のみユニットテスト対象。
  API呼び出し自体はネットワーク依存のためテスト対象外）。
- **認証情報の配置**：サービスアカウント鍵は`scripts/.secrets/search-console-service-account.json`に置く想定
  （`.gitignore`済み・リポジトリには含めない）。取得した生データ（`scripts/.seo-data/latest.json`）も同様に
  `.gitignore`済みで、週次実行のたびに上書きされる一時データという位置づけ（履歴として残す必要はない）。
- **改善内容の生成**：`scripts/weekly-seo-prompt.md`は`weekly-draft-prompt.md`と同じ「`claude -p`ヘッドレス実行」
  方式を踏襲する。許可する変更は3種類のみに限定：
  1. 低CTRページに対応する公開済み記事の`title`/`description`の改善（事実の捏造禁止、既存の検証済み情報の範囲内）
  2. 掲載順位が低い高インプレッションキーワードを`docs/seo-keywords.md`の未使用項目として追加
     （既存の週次下書き生成パイプラインが次回以降に拾って新規記事を作る導線。このパイプライン自身は新規記事本文は作らない）
  3. 公開済み記事同士の`relatedLinks`補強（既存リンクの削除はしない、draft記事へはリンクしない）
  `status`・`slug`・`publishDate`・`heroImage`・本文の構造的書き換えは禁止。1回の実行で変更する記事数は
  最大5件までとし、影響範囲を意図的に絞る。
- **完全自動の範囲とセーフティネット**：`weekly-seo.ps1`は`weekly-draft.ps1`由来の「claude実行前後の
  `git status --porcelain`差分検知」と、`auto-publish.ps1`由来の「lint/test/buildゲート＋失敗時のrevert」を
  組み合わせる。
  1. データ取得失敗（認証情報未配置・API未有効化・ネットワークエラー等）→ commit/pushせずログのみ記録して終了
  2. `claude -p`が`src/data/articles.js`・`docs/seo-keywords.md`以外のファイルを変更→想定外とみなし、
     この2ファイルの変更のみ`git checkout --`で破棄（他の想定外ファイルは人間確認のため削除せず残す）、
     commit/pushせずログのみ記録
  3. 変更なし（今週は改善余地なしと判断）→ 何もせず正常終了
  4. `npm run lint`/`test`/`build`のいずれか失敗→ 2.と同様に対象2ファイルの変更を破棄
  5. 全ゲート通過→ 対象2ファイルのみ`git add`・`git commit`・`git push`。Vercelが自動デプロイする
  結果は成功・失敗いずれも`docs/seo-improvement-log.md`にタイムスタンプ付きで追記する。
- **要ユーザー作業（実装だけでは完結しない部分）**：Search Console側のドメイン所有権確認とサービスアカウントへの
  権限付与はGoogleアカウントの操作を伴うため、Claude単独では完結できない。ユーザーに依頼した手順：
  1. Google Search Consoleで`tabi-uzbekistan.com`のプロパティを追加し、DNS TXTレコード（またはHTMLタグ等）で
     所有権を確認する
  2. Google Cloud Consoleでプロジェクトを作成（または既存のものを利用）し、Search Console API（Webmasters API）を有効化
  3. サービスアカウントを作成しJSON鍵をダウンロード、`scripts/.secrets/search-console-service-account.json`に配置
  4. Search Consoleのプロパティ設定→ユーザーと権限で、3.のサービスアカウントのメールアドレスを
     「制限付き」（読み取りで十分）ユーザーとして追加
  これらが完了するまで`weekly-seo.ps1`はステップ1（データ取得）で失敗し、失敗ログが記録される安全な状態を保つ。
- **方針転換の位置づけ**：§8.5.6と同様、「published記事の内容変更を人間の確認なしに本番反映する」という運用は
  この機能に限りユーザーが個別に許可したものであり、恒常方針への変更ではない。ただし本機能は変更範囲を
  title/description/内部リンク/キーワードキューの追加のみに限定し、本文の事実的記述や構造には一切手を加えない設計と
  することで、完全自動でもリスクを抑えている。

## 9. 設計上の原則まとめ
- **単一国特化**：ウズベキスタン専門。他国は別サイトとして扱い、本サイトに抽象化を持ち込まない。
- **DRY・単一責任**：レイヤー分離（data / core / ui / utils）を厳守。
- **テスト容易性**：ロジックはDOM非依存に隔離しVitestで担保。
- **メモリ準拠**：画像背景色ルール・確認不要ルール・開発標準（ドキュメントファースト／TDD／ビルドエラーゼロ）を反映。
