import slugify from "slugify";
import Sentenser from "sentencer";

export default function makeSlug(text: string): string {
  const slug = slugify(text, { strict: true, lower: true });

  if (!slug) {
    return makeSlug(Sentenser.make("{{ adjective }} {{ noun }}"));
  }

  return slug;
}
