// ウズベキスタン 国別データ（純粋データのみ・ロジックを持たない）
export default {
  id: "uzbekistan",
  name: "ウズベキスタン",
  nameEn: "Uzbekistan",
  tagline: "青の都サマルカンドとシルクロードの至宝",
  heroImage: "/images/uzbekistan/hero.jpg",
  overview:
    "中央アジアの中心に位置し、サマルカンド・ブハラ・ヒヴァといったシルクロードの隊商都市が今も往時の姿を残す。青いタイルに彩られたモスクやメドレセ（神学校）が旅人を魅了する、世界遺産の宝庫。",

  basicInfo: {
    language: "ウズベク語・ロシア語",
    currency: "スム（UZS）",
    timezone: "UTC+5（日本より4時間遅い）",
    visa: "30日以内の観光はビザ不要（日本国籍）",
  },

  safety: {
    level: "比較的安全",
    summary:
      "中央アジアの中では治安は良好。観光地では警察の巡回も多く、旅行者トラブルは少ない。",
    notes: [
      "市場や駅ではスリ・置き引きに注意",
      "夜間の人けのない場所での一人歩きは避ける",
      "無許可の白タクではなく配車アプリ（Yandex Go）を利用する",
    ],
  },

  currency: {
    code: "UZS",
    roughRate: "1円 ≒ 90スム（目安・変動あり）",
  },

  bestSeason: {
    recommended: "4〜5月・9〜10月",
    reason: "気候が穏やかで日中も過ごしやすく、観光に最適。夏は40℃超の酷暑となる。",
  },

  budget: {
    daily: "1日 5,000〜12,000円",
    breakdown: [
      { item: "宿泊", cost: "2,000〜6,000円（ゲストハウス〜中級ホテル）" },
      { item: "食事", cost: "1,000〜3,000円" },
      { item: "交通・観光", cost: "1,500〜3,000円" },
    ],
  },

  preparation: {
    items: [
      "パスポート残存期間（入国時3か月以上推奨）の確認",
      "現金（USD）の準備。新札・高額紙幣が両替に有利",
      "常備薬・胃腸薬",
    ],
    notes: [
      "両替はホテル・銀行・公式両替所で。闇両替は避ける",
      "クレジットカードは都市部中級店以上で使えるが現金主体",
    ],
  },

  modelCourses: [
    {
      id: "uz-3days",
      title: "サマルカンド集中3日間",
      days: 3,
      summary: "世界遺産サマルカンドの主要スポットを効率よく巡る短期プラン。",
      itinerary: [
        { day: 1, title: "レギスタン広場", detail: "3つのメドレセに囲まれた大広場を昼と夜の両方で鑑賞する。" },
        { day: 2, title: "シャーヒ・ズィンダ廟群", detail: "青タイルの霊廟群を巡り、ビビハニム・モスクへ。" },
        { day: 3, title: "グーリ・アミール廟", detail: "ティムールの霊廟を見学し、市場で買い物をして締めくくる。" },
      ],
    },
    {
      id: "uz-7days",
      title: "シルクロード縦断7日間",
      days: 7,
      summary: "タシケント・サマルカンド・ブハラ・ヒヴァの4都市を鉄道で結ぶ王道周遊。",
      itinerary: [
        { day: 1, title: "タシケント", detail: "首都を散策し地下鉄駅の装飾を鑑賞。" },
        { day: 2, title: "サマルカンド（高速鉄道）", detail: "レギスタン広場とビビハニム・モスク。" },
        { day: 3, title: "サマルカンド", detail: "シャーヒ・ズィンダ廟群とウルグベク天文台跡。" },
        { day: 4, title: "ブハラ", detail: "旧市街のミナレットと隊商宿を巡る。" },
        { day: 5, title: "ブハラ", detail: "アルク城とラビハウズ池周辺を散策。" },
        { day: 6, title: "ヒヴァ", detail: "城壁に囲まれたイチャンカラ旧市街を歩く。" },
        { day: 7, title: "ヒヴァ→帰国", detail: "朝の旧市街を散策後、ウルゲンチ空港へ。" },
      ],
    },
  ],

  attractions: [
    {
      id: "registan",
      name: "レギスタン広場",
      city: "サマルカンド",
      image: "/images/uzbekistan/registan.jpg",
      description: "3つのメドレセに囲まれたサマルカンドの象徴。青いタイル装飾が圧巻で、夜間ライトアップも美しい。",
      dominantColor: "#6d8bb6",
    },
    {
      id: "shah-i-zinda",
      name: "シャーヒ・ズィンダ廟群",
      city: "サマルカンド",
      image: "/images/uzbekistan/shah-i-zinda.jpg",
      description: "細い参道の両側に並ぶ青タイルの霊廟群。「生ける王」を意味する聖地。",
      dominantColor: "#5f5553",
    },
    {
      id: "ark-fortress",
      name: "アルク城",
      city: "ブハラ",
      image: "/images/uzbekistan/ark-fortress.jpg",
      description: "ブハラ王朝の歴代君主が居城とした要塞。日干しレンガの巨大な城壁がそびえ、内部には博物館もある。",
      dominantColor: "#7a8ca9",
    },
    {
      id: "itchan-kala",
      name: "イチャンカラ（内城）",
      city: "ヒヴァ",
      image: "/images/uzbekistan/itchan-kala.jpg",
      description: "城壁に囲まれた保存状態の良い旧市街。街全体が世界遺産の博物館都市。",
      dominantColor: "#4c4d52",
    },
  ],
};
