// 表示ラベル定数（DRY: 表示文言を一元管理）
export const labels = {
  siteName: "中央アジア観光ガイド",
  tagline: "シルクロードの至宝、ウズベキスタン・キルギスへ",

  nav: {
    home: "ホーム",
    about: "このサイトについて",
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
    selectCountry: "国を選ぶ",
    backToTop: "トップへ戻る",
  },
};

export default labels;
