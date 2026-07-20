// 国データの必須フィールド検証（DOM非依存・純粋関数）
// 戻り値: { valid: boolean, missing: string[] }

// トップレベル必須フィールド
const REQUIRED_TOP = [
  "id",
  "name",
  "nameEn",
  "tagline",
  "heroImage",
  "overview",
  "basicInfo",
  "safety",
  "currency",
  "bestSeason",
  "budget",
  "preparation",
  "modelCourses",
  "attractions",
];

// basicInfo のネスト必須フィールド
const REQUIRED_BASIC_INFO = ["language", "currency", "timezone", "visa"];

// 空配列を「不足」とみなすフィールド
const NON_EMPTY_ARRAYS = ["modelCourses", "attractions"];

function isPresent(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
}

export function validateCountry(data) {
  const missing = [];

  if (!data || typeof data !== "object") {
    return { valid: false, missing: [...REQUIRED_TOP] };
  }

  for (const key of REQUIRED_TOP) {
    if (!isPresent(data[key])) {
      missing.push(key);
      continue;
    }
    // 非空配列チェック
    if (NON_EMPTY_ARRAYS.includes(key)) {
      if (!Array.isArray(data[key]) || data[key].length === 0) {
        missing.push(key);
      }
    }
  }

  // basicInfo のネストフィールド
  if (data.basicInfo && typeof data.basicInfo === "object") {
    for (const key of REQUIRED_BASIC_INFO) {
      if (!isPresent(data.basicInfo[key])) {
        missing.push(`basicInfo.${key}`);
      }
    }
  }

  return { valid: missing.length === 0, missing };
}

export default validateCountry;
