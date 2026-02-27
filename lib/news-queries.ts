import { getNewsCollection } from "@/lib/mongodb";
import type { News } from "@/lib/types/news";

export async function getNewsArticleBySlug(slug: string): Promise<News | null> {
  const collection = await getNewsCollection();
  const article = await collection.findOne({ slug, isActive: true });

  if (!article) return null;

  return {
    slug: article.slug,
    imageSrc: article.imageSrc,
    tag: article.tag,
    date: article.date,
    title: article.title,
    bodyText: article.bodyText || article.description,
    cta: article.cta,
    content: article.content,
    category: article.category,
    source: article.source,
    author: article.author,
    url: article.url,
  };
}
