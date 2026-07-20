// ISO日付文字列（YYYY-MM-DD）を日本語表記（YYYY年M月D日）に整形する。
// パースできない場合は入力をそのまま返す（安全にフォールバック）。
export function formatDate(iso) {
  if (typeof iso !== "string") return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return `${y}年${Number(mo)}月${Number(d)}日`;
}

export default formatDate;
