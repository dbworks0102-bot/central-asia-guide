// トップページ用の国一覧（表示に必要な最小フィールドのみ）を返す。
import { countries } from "../data/index.js";

export function getAllCountries() {
  return countries.map(({ id, name, tagline, heroImage }) => ({
    id,
    name,
    tagline,
    heroImage,
  }));
}

export default getAllCountries;
