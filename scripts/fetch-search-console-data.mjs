// 週次SEO改善パイプライン（scripts/weekly-seo.ps1）用のデータ取得。
// Google Search Console API（searchAnalytics.query）からpage別・query別データを取得し、
// 低CTRページ・掲載順位が低い高インプレッションキーワードを抽出してJSONに保存する。
// 抽出ロジック（summarizeSearchConsoleData）のみ純粋関数としてユニットテスト対象。
// API呼び出し自体（認証・ネットワーク）はテスト対象外。
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { GoogleAuth } from "google-auth-library";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = resolve(__dirname, ".secrets/search-console-service-account.json");
const OUTPUT_PATH = resolve(__dirname, ".seo-data/latest.json");
const SITE_URL = "https://tabi-uzbekistan.com/";

const LOW_CTR_MIN_IMPRESSIONS = 20;
const LOW_CTR_MAX_CTR = 0.02;
const KEYWORD_GAP_MIN_IMPRESSIONS = 10;
const KEYWORD_GAP_MIN_POSITION = 10;
const MAX_LOW_CTR_PAGES = 10;
const MAX_KEYWORD_GAPS = 15;

export function summarizeSearchConsoleData(pageRows, queryRows) {
  const lowCtrPages = pageRows
    .filter((r) => r.impressions >= LOW_CTR_MIN_IMPRESSIONS && r.ctr < LOW_CTR_MAX_CTR)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, MAX_LOW_CTR_PAGES)
    .map((r) => ({
      page: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));

  const keywordGaps = queryRows
    .filter((r) => r.impressions >= KEYWORD_GAP_MIN_IMPRESSIONS && r.position >= KEYWORD_GAP_MIN_POSITION)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, MAX_KEYWORD_GAPS)
    .map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));

  return { lowCtrPages, keywordGaps };
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

async function querySearchAnalytics(auth, dimensions) {
  const client = await auth.getClient();
  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - 3); // 直近3日は未確定データのため除外
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 28);

  const res = await client.request({
    url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    method: "POST",
    data: {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      dimensions,
      rowLimit: 500,
    },
  });
  return res.data.rows || [];
}

async function main() {
  if (!existsSync(KEY_PATH)) {
    console.log("NO_CREDENTIALS");
    process.exitCode = 1;
    return;
  }

  const auth = new GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const [pageRows, queryRows] = await Promise.all([
    querySearchAnalytics(auth, ["page"]),
    querySearchAnalytics(auth, ["query"]),
  ]);

  const summary = summarizeSearchConsoleData(pageRows, queryRows);

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(
    OUTPUT_PATH,
    JSON.stringify({ fetchedAt: new Date().toISOString(), ...summary }, null, 2),
    "utf8"
  );
  console.log("OK");
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((err) => {
    console.error(err.stack || String(err));
    process.exitCode = 1;
  });
}
