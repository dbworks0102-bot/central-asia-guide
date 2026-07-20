// キルギス 国別データ（純粋データのみ・ロジックを持たない）
export default {
  id: "kyrgyzstan",
  name: "キルギス",
  nameEn: "Kyrgyzstan",
  tagline: "天山山脈と遊牧文化、中央アジアの秘境",
  heroImage: "/images/kyrgyzstan/hero.jpg",
  overview:
    "国土の大半を天山山脈が占める山岳国家。夏には遊牧民が高原にユルト（移動式住居）を張り、湖と草原が広がる雄大な自然が魅力。トレッキングと遊牧文化体験の宝庫。",

  basicInfo: {
    language: "キルギス語・ロシア語",
    currency: "ソム（KGS）",
    timezone: "UTC+6（日本より3時間遅い）",
    visa: "60日以内の観光はビザ不要（日本国籍）",
  },

  safety: {
    level: "おおむね安全",
    summary:
      "首都ビシュケクや観光地は比較的安全。山岳地帯では天候の急変と高地に注意が必要。",
    notes: [
      "山間部は天候が急変しやすく防寒・雨具が必須",
      "高地（3,000m超）では高山病に注意",
      "夜間の繁華街では酔客とのトラブルを避ける",
    ],
  },

  currency: {
    code: "KGS",
    roughRate: "1円 ≒ 0.6ソム（目安・変動あり）",
  },

  bestSeason: {
    recommended: "6〜9月",
    reason: "山岳・湖のベストシーズンで遊牧民のユルトも見られる。冬は積雪でアクセス困難な地域が多い。",
  },

  budget: {
    daily: "1日 4,000〜10,000円",
    breakdown: [
      { item: "宿泊", cost: "1,500〜5,000円（ユルト泊〜ホテル）" },
      { item: "食事", cost: "800〜2,500円" },
      { item: "交通・ツアー", cost: "1,500〜4,000円" },
    ],
  },

  preparation: {
    items: [
      "パスポート残存期間の確認",
      "防寒着・雨具・歩きやすい登山靴",
      "現金（USD）と一部ソム。山間部はカード不可が多い",
    ],
    notes: [
      "山岳ツアーは首都の旅行会社で事前手配すると安心",
      "湖・高原エリアはATMが少ないため現金を多めに用意する",
    ],
  },

  modelCourses: [
    {
      id: "kg-4days",
      title: "イシク・クル湖と自然満喫4日間",
      days: 4,
      summary: "首都ビシュケクを起点にイシク・クル湖と周辺の峡谷を巡る自然重視プラン。",
      itinerary: [
        { day: 1, title: "ビシュケク", detail: "首都を散策しオシュ・バザールで食材と工芸品を見る。" },
        { day: 2, title: "イシク・クル湖（チョルポンアタ）", detail: "世界第2の山岳湖の湖畔でのんびり過ごす。" },
        { day: 3, title: "ジェティ・オグズ峡谷", detail: "赤い岩壁「七頭の牛」を望むトレッキング。" },
        { day: 4, title: "ブラナの塔→帰国", detail: "草原に立つ古塔を見学し首都へ戻る。" },
      ],
    },
    {
      id: "kg-7days",
      title: "遊牧文化とトレッキング7日間",
      days: 7,
      summary: "ソンクル湖のユルト泊を含む、遊牧文化を深く体験する周遊プラン。",
      itinerary: [
        { day: 1, title: "ビシュケク", detail: "到着・市内観光。" },
        { day: 2, title: "ブラナの塔", detail: "シルクロードの古塔と石人を見学。" },
        { day: 3, title: "ソンクル湖", detail: "標高3,000mの高原湖でユルト泊。" },
        { day: 4, title: "ソンクル湖", detail: "乗馬と遊牧民の暮らし体験。" },
        { day: 5, title: "コチコル→イシク・クル", detail: "湖畔へ移動しフェルト工芸を見学。" },
        { day: 6, title: "ジェティ・オグズ峡谷", detail: "峡谷トレッキングと温泉。" },
        { day: 7, title: "ビシュケク→帰国", detail: "首都へ戻り土産を購入。" },
      ],
    },
  ],

  attractions: [
    {
      id: "issyk-kul",
      name: "イシク・クル湖",
      city: "チョルポンアタ",
      image: "/images/kyrgyzstan/issyk-kul.jpg",
      description: "天山山脈に囲まれた世界第2の山岳湖。塩分を含み冬でも凍らない「熱い湖」。",
      dominantColor: "#3b7ea1",
    },
    {
      id: "song-kul",
      name: "ソンクル湖",
      city: "ナルン",
      image: "/images/kyrgyzstan/song-kul.jpg",
      description: "標高約3,000mの高原に広がる湖。夏は遊牧民のユルトが点在し、満天の星空が楽しめる。",
      dominantColor: "#4a7c59",
    },
    {
      id: "jeti-oguz",
      name: "ジェティ・オグズ峡谷",
      city: "カラコル近郊",
      image: "/images/kyrgyzstan/jeti-oguz.jpg",
      description: "「七頭の牛」を意味する赤い岩壁が連なる峡谷。トレッキングの名所。",
      dominantColor: "#a4503a",
    },
    {
      id: "burana-tower",
      name: "ブラナの塔",
      city: "トクモク近郊",
      image: "/images/kyrgyzstan/burana-tower.jpg",
      description: "草原に立つ11世紀の古塔と石人（バルバル）。シルクロードの隊商都市跡。",
      dominantColor: "#8a7d55",
    },
  ],
};
