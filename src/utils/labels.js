// 表示ラベル定数（DRY: 表示文言を一元管理）
export const labels = {
  siteName: "ウズベキスタン旅行ガイド",
  tagline: "青の都サマルカンドとシルクロードの至宝",

  nav: {
    home: "ホーム",
    about: "このサイトについて",
    articles: "コラム",
  },

  // 記事（コラム）関連ラベル
  articles: {
    listTitle: "コラム",
    listLead: "ウズベキスタン旅行の計画に役立つ読み物コラムです。",
    empty: "現在公開中のコラムはありません。",
    relatedTitle: "あわせて読みたい",
    backToList: "コラム一覧へ戻る",
  },

  // 国別ページのセクション見出し
  sections: {
    overview: "国の概要",
    basicInfo: "基本情報",
    safety: "治安・安全情報",
    bestSeason: "ベストシーズン",
    budget: "費用感",
    preparation: "渡航準備",
    modelCourses: "おすすめモデルコース",
    attractions: "主要観光地",
  },

  // basicInfo の各フィールドラベル（国データの basicInfo キーと一致させる）
  basicInfo: {
    language: "言語",
    currency: "通貨",
    timezone: "時差",
    visa: "ビザ",
  },

  // 汎用ラベル
  common: {
    dayPrefix: "Day",
    daysSuffix: "日間",
    dailyBudget: "1日あたりの目安",
    safetyLevel: "安全度",
    breakdown: "内訳",
    preparationItems: "持ち物・手続き",
    notes: "注意点",
    backToTop: "トップへ戻る",
  },
};

export default labels;
