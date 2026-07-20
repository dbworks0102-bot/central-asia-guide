// メタタグ・OGP・構造化データ（JSON-LD）生成と適用
// buildMeta / buildCountryMeta / buildCountryJsonLd は純粋関数（テスト対象）。
// applyMeta は DOM 副作用を持つ（ブラウザ実行時のみ利用）。
import { labels } from "./labels.js";

const SITE_NAME = labels.siteName;
const SITE_URL = "https://tabi-uzbekistan.com";
const DEFAULT_IMAGE = "/images/ogp.jpg";

// title に必ずサイト名を付与する
function withSiteName(title) {
  if (!title) return SITE_NAME;
  return title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
}

// サイトルート相対パスを絶対URLに変換する（OGP/canonicalは絶対URL必須のため）
function toAbsoluteUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// 汎用メタ生成
export function buildMeta({ title, description = "", url = "/", image = DEFAULT_IMAGE, type = "website" } = {}) {
  const fullTitle = withSiteName(title);
  const absoluteUrl = toAbsoluteUrl(url);
  const absoluteImage = toAbsoluteUrl(image);
  return {
    title: fullTitle,
    description,
    canonicalUrl: absoluteUrl,
    og: {
      title: fullTitle,
      description,
      image: absoluteImage,
      url: absoluteUrl,
      type,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      image: absoluteImage,
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

// 記事データからメタを生成（buildCountryMeta と同じ絶対URL変換ルールに従う）
export function buildArticleMeta(article) {
  return buildMeta({
    title: article.title,
    description: article.description,
    url: `/articles/${article.slug}`,
    image: article.heroImage,
    type: "article",
  });
}

// 記事データから Article 相当の JSON-LD を生成（image は絶対URL必須）
export function buildArticleJsonLd(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: toAbsoluteUrl(article.heroImage),
    datePublished: article.publishDate,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
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

function setCanonicalLink(href) {
  if (typeof document === "undefined") return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function applyMeta(meta, jsonLd) {
  if (typeof document === "undefined") return;
  document.title = meta.title;
  setMetaTag("name", "description", meta.description);
  setCanonicalLink(meta.canonicalUrl);

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

export default {
  buildMeta,
  buildCountryMeta,
  buildCountryJsonLd,
  buildArticleMeta,
  buildArticleJsonLd,
  applyMeta,
};
