// IDから国データを取得する。未存在・不正引数なら null（安全にフォールバック）。
import { countriesById } from "../data/index.js";

export function getCountryData(id) {
  if (!id || typeof id !== "string") return null;
  return countriesById[id] || null;
}

export default getCountryData;
