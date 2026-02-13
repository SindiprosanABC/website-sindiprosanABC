import slugify from "slugify";

export function generateSlug(title: string, publishedAt?: Date): string {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: "pt",
    remove: /[*+~.()'"!:@]/g,
  });

  // Add date suffix to ensure uniqueness
  if (publishedAt) {
    const dateSuffix = publishedAt.toISOString().split("T")[0];
    return `${baseSlug}-${dateSuffix}`;
  }

  return baseSlug;
}

export function generateUniqueSlug(
  title: string,
  existingSlugs: string[],
): string {
  let slug = generateSlug(title);
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${generateSlug(title)}-${counter}`;
    counter++;
  }

  return slug;
}
