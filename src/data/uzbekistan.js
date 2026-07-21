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
    daily: "1日 5,000〜12,000円（航空券別）",
    breakdown: [
      { item: "宿泊", cost: "2,000〜6,000円（ゲストハウス〜中級ホテル）" },
      { item: "食事・飲み物", cost: "1,000〜3,500円" },
      { item: "現地交通・タクシー", cost: "1,500〜4,500円" },
      { item: "観光（入場料等）", cost: "500〜1,500円" },
      { item: "お土産", cost: "個人差が大きいが目安3,000〜4,000円/日" },
    ],
    note: "実際の旅行者の記録（10日間・航空券除く）では合計約139,000円（1日あたり約14,000円、お土産込み）。航空券は往復12万円前後が目安。",
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
    {
      id: "uz-11days-real",
      title: "実体験11日間モデルコース",
      days: 11,
      summary: "実際の旅行者が辿ったルート。タシケントを起点にヒヴァ→ブハラ→サマルカンドと巡り、再びタシケントから帰国する周遊型プラン。",
      itinerary: [
        { day: 1, title: "日本→仁川", detail: "成田発、仁川着で1泊。" },
        { day: 2, title: "仁川→タシュケント→ヒヴァ", detail: "タシュケント到着後、国内線・列車でヒヴァへ移動。宿泊：Xiva Shahriston。" },
        { day: 3, title: "ヒヴァ", detail: "城壁に囲まれたイチャンカラ旧市街を終日散策。" },
        { day: 4, title: "ヒヴァ→ブハラ", detail: "列車で移動（約7時間）。宿泊：Minorai Xurd。" },
        { day: 5, title: "ブハラ", detail: "旧市街とアルク城を見学。" },
        { day: 6, title: "ブハラ", detail: "隊商宿やラビハウズ池周辺を散策。" },
        { day: 7, title: "ブハラ→サマルカンド", detail: "列車で移動（早朝発）。宿泊：Registon Saroy Hotel。" },
        { day: 8, title: "サマルカンド", detail: "レギスタン広場・シャーヒ・ズィンダ廟群を見学。" },
        { day: 9, title: "サマルカンド→タシュケント", detail: "列車で移動。宿泊：City Centre Hotel。" },
        { day: 10, title: "タシュケント", detail: "首都市内観光、お土産の買い足し。" },
        { day: 11, title: "タシュケント→仁川→日本", detail: "深夜便で出発し帰国。" },
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
      articleSlug: "samarkand-registan-square-highlights",
    },
    {
      id: "shah-i-zinda",
      name: "シャーヒ・ズィンダ廟群",
      city: "サマルカンド",
      image: "/images/uzbekistan/shah-i-zinda.jpg",
      description: "細い参道の両側に並ぶ青タイルの霊廟群。「生ける王」を意味する聖地。",
      dominantColor: "#5f5553",
      articleSlug: "shah-i-zinda-mausoleum-highlights",
    },
    {
      id: "ark-fortress",
      name: "アルク城",
      city: "ブハラ",
      image: "/images/uzbekistan/ark-fortress.jpg",
      description: "ブハラ王朝の歴代君主が居城とした要塞。日干しレンガの巨大な城壁がそびえ、内部には博物館もある。",
      dominantColor: "#7a8ca9",
      articleSlug: "bukhara-old-town-attractions",
    },
    {
      id: "itchan-kala",
      name: "イチャンカラ（内城）",
      city: "ヒヴァ",
      image: "/images/uzbekistan/itchan-kala.jpg",
      description: "城壁に囲まれた保存状態の良い旧市街。街全体が世界遺産の博物館都市。",
      dominantColor: "#4c4d52",
      articleSlug: "khiva-itchan-kala-highlights",
    },
  ],
};
