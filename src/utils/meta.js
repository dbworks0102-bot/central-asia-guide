// メタタグ・OGP・構造化データ（JSON-LD）生成と適用
// buildMeta / buildCountryMeta / buildCountryJsonLd は純粋関数（テスト対象）。
// applyMeta は DOM 副作用を持つ（ブラウザ実行時のみ利用）。
import { labels } from "./labels.js";

const SITE_NAME = labels.siteName;
const DEFAULT_IMAGE = "/images/ogp.jpg";

// title に必ずサイト名を付与する
function withSiteName(title) {
  if (!title) return SITE_NAME;
  return title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
}

// 汎用メタ生成
export function buildMeta({ title, description = "", url = "/", image = DEFAULT_IMAGE, type = "website" } = {}) {
  const fullTitle = withSiteName(title);
  return {
    title: fullTitle,
    description,
    og: {
      title: fullTitle,
      description,
      image,
      url,
      type,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      image,
    },
  };
}

// 国データからメタを生成
export function buildCountryMeta(country) {
  return buildMeta({
    title: `${country.name}の観光ガイド`,
    description: country.overview,
    url: `/${country.id}`,
    image: country.heroImage,
    type: "article",
  });
}

// 国データから TouristDestination 相当の JSON-LD を生成
export function buildCountryJsonLd(country) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: country.nameEn,
    alternateName: country.name,
    description: country.overview,
    image: country.heroImage,
    touristType: "個人旅行者（FIT）",
  };
}

// --- DOM 適用（ブラウザ実行時のみ） ---

function setMetaTag(attr, key, content) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function applyMeta(meta, jsonLd) {
  if (typeof document === "undefined") return;
  document.title = meta.title;
  setMetaTag("name", "description", meta.description);

  setMetaTag("property", "og:title", meta.og.title);
  setMetaTag("property", "og:description", meta.og.description);
  setMetaTag("property", "og:image", meta.og.image);
  setMetaTag("property", "og:url", meta.og.url);
  setMetaTag("property", "og:type", meta.og.type);
  setMetaTag("property", "og:site_name", meta.og.siteName);

  setMetaTag("name", "twitter:card", meta.twitter.card);
  setMetaTag("name", "twitter:title", meta.twitter.title);
  setMetaTag("name", "twitter:description", meta.twitter.description);
  setMetaTag("name", "twitter:image", meta.twitter.image);

  // JSON-LD
  const existing = document.head.querySelector('script[data-meta="jsonld"]');
  if (existing) existing.remove();
  if (jsonLd) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-meta", "jsonld");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}

export default { buildMeta, buildCountryMeta, buildCountryJsonLd, applyMeta };
