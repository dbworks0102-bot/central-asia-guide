// 国データの集約・エクスポート（ウズベキスタン専門サイト：単一国）
import uzbekistan from "./uzbekistan.js";

// 表示順を保持した配列（単一国だが core の共通APIを維持するため配列で保持）
export const countries = [uzbekistan];

// id をキーにした索引（getCountryData 用）
export const countriesById = countries.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

export default countries;
