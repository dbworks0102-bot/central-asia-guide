// 全国データの集約・エクスポート
// 国を追加する場合はここに import 追加し countries に並べるだけで拡張可能。
import uzbekistan from "./uzbekistan.js";
import kyrgyzstan from "./kyrgyzstan.js";

// 表示順を保持した配列
export const countries = [uzbekistan, kyrgyzstan];

// id をキーにした索引（getCountryData 用）
export const countriesById = countries.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

export default countries;
