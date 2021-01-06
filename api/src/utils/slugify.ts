import slugify from "slugify";

function utf8ToHex(str) {
  return Array.from(str)
    .map((c: string) =>
      c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : encodeURIComponent(c).replace(/\%/g, "").toLowerCase()
    )
    .join("");
}

export default function makeSlug(text: string): string {
  const slug = slugify(text, { strict: true, lower: true });

  if (!slug) {
    return utf8ToHex(text);
  }

  return slug;
}
