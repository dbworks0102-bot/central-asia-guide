import { describe, it, expect } from "vitest";
import { summarizeSearchConsoleData } from "../../scripts/fetch-search-console-data.mjs";

function pageRow(page, { clicks = 0, impressions, ctr, position = 5 }) {
  return { keys: [page], clicks, impressions, ctr, position };
}

function queryRow(query, { clicks = 0, impressions, ctr = 0.01, position }) {
  return { keys: [query], clicks, impressions, ctr, position };
}

describe("scripts/fetch-search-console-data - summarizeSearchConsoleData", () => {
  it("掲載回数20以上かつCTR2%未満のページのみ低CTRページとして抽出する", () => {
    const pageRows = [
      pageRow("/articles/a", { impressions: 50, ctr: 0.01 }),
      pageRow("/articles/b", { impressions: 10, ctr: 0.01 }), // 掲載回数不足
      pageRow("/articles/c", { impressions: 50, ctr: 0.05 }), // CTR十分
    ];
    const { lowCtrPages } = summarizeSearchConsoleData(pageRows, []);
    expect(lowCtrPages).toHaveLength(1);
    expect(lowCtrPages[0].page).toBe("/articles/a");
  });

  it("低CTRページを掲載回数の降順で並べ、上位10件に絞る", () => {
    const pageRows = Array.from({ length: 15 }, (_, i) =>
      pageRow(`/articles/${i}`, { impressions: 100 + i, ctr: 0.01 })
    );
    const { lowCtrPages } = summarizeSearchConsoleData(pageRows, []);
    expect(lowCtrPages).toHaveLength(10);
    expect(lowCtrPages[0].page).toBe("/articles/14");
    expect(lowCtrPages[9].page).toBe("/articles/5");
  });

  it("掲載回数10以上かつ平均掲載順位10位以下のクエリのみキーワード機会として抽出する", () => {
    const queryRows = [
      queryRow("ウズベキスタン 観光", { impressions: 30, position: 12 }),
      queryRow("ウズベキスタン ビザ", { impressions: 5, position: 15 }), // 掲載回数不足
      queryRow("ウズベキスタン ホテル", { impressions: 30, position: 3 }), // 順位が高すぎる（対象外）
    ];
    const { keywordGaps } = summarizeSearchConsoleData([], queryRows);
    expect(keywordGaps).toHaveLength(1);
    expect(keywordGaps[0].query).toBe("ウズベキスタン 観光");
  });

  it("キーワード機会を掲載回数の降順で並べ、上位15件に絞る", () => {
    const queryRows = Array.from({ length: 20 }, (_, i) =>
      queryRow(`キーワード${i}`, { impressions: 100 + i, position: 15 })
    );
    const { keywordGaps } = summarizeSearchConsoleData([], queryRows);
    expect(keywordGaps).toHaveLength(15);
    expect(keywordGaps[0].query).toBe("キーワード19");
  });

  it("該当データが無い場合は両方とも空配列を返す", () => {
    const { lowCtrPages, keywordGaps } = summarizeSearchConsoleData([], []);
    expect(lowCtrPages).toEqual([]);
    expect(keywordGaps).toEqual([]);
  });
});
