import { describe, it, expect } from "vitest";
import { getAllCountries } from "../../src/core/getAllCountries.js";
import { getCountryData } from "../../src/core/getCountryData.js";
import { validateCountry } from "../../src/core/validateCountry.js";

const ids = getAllCountries().map((c) => c.id);

describe("データ整合性", () => {
  it.each(ids)("%s は validateCountry を通過する", (id) => {
    const res = validateCountry(getCountryData(id));
    expect(res.missing).toEqual([]);
    expect(res.valid).toBe(true);
  });

  it.each(ids)("%s は modelCourses を最低1つ持つ", (id) => {
    const c = getCountryData(id);
    expect(c.modelCourses.length).toBeGreaterThanOrEqual(1);
  });

  it.each(ids)("%s は attractions を最低3つ持つ", (id) => {
    const c = getCountryData(id);
    expect(c.attractions.length).toBeGreaterThanOrEqual(3);
  });

  it.each(ids)("%s の各attractionは16進dominantColorを持つ", (id) => {
    const c = getCountryData(id);
    for (const a of c.attractions) {
      expect(a.dominantColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it.each(ids)("%s の各attractionは画像パス /images/{id}/ を持つ", (id) => {
    const c = getCountryData(id);
    for (const a of c.attractions) {
      expect(a.image).toMatch(new RegExp(`^/images/${id}/`));
    }
  });
});
