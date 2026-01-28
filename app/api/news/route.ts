import { NextRequest, NextResponse } from "next/server";
import { getNewsCollection } from "@/lib/mongodb";
import type { News } from "@/lib/types/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category") || "medicina";

    const collection = await getNewsCollection();

    // Get single article by slug
    if (slug) {
      const article = await collection.findOne({
        slug,
        category,
        isActive: true,
      });

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 },
        );
      }

      // Transform MongoDB document to News type
      const news: News = {
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

      return NextResponse.json({ news });
    }

    // Get paginated list of articles
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      collection
        .find({
          isActive: true,
          category,
        })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments({
        isActive: true,
        category,
      }),
    ]);

    // Transform to News[] type
    const newsList: News[] = articles.map((article) => ({
      slug: article.slug,
      imageSrc: article.imageSrc,
      tag: article.tag,
      date: article.date,
      title: article.title,
      bodyText: article.bodyText || article.description,
      cta: article.cta,
      content: article.content,
      category: article.category,
      url: article.url,
    }));

    return NextResponse.json({
      news: newsList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[API] Error fetching news:", errorMessage);

    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 },
    );
  }
}
