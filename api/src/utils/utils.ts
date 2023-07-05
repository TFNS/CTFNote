import slugify from "slugify";

// mirrored from the frontend
export function safeSlugify(str: string) {
  return slugify(str) || "no-slug-for-you";
}
