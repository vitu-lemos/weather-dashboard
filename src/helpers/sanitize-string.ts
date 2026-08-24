/**
 * Trim, strip control/HTML/SQL-metacharacters, collapse whitespace, drop
 * delimiter-breaking commas.
 */
export function sanitizeString(
  input: string,
  { preserveCommas = false } = {},
): string {
  return input
    .replace(/[\x00-\x1F\x7F]/g, "") // control chars
    .replace(/<[^>]*>/g, "") // html/script tags
    .replace(/[<>'"`;]/g, "") // xss/sql metacharacters
    .replace(/(--|\/\*|\*\/)/g, "") // sql comment sequences
    .replace(/,/g, preserveCommas ? "," : "") // remove commas by default
    .trim()
    .replace(/\s+/g, " ");
}
