import { NextRequest, NextResponse } from "next/server";
import { createNewsAPIClient } from "@/lib/newsapi";
import { getNewsCollection } from "@/lib/mongodb";
import { transformBatchArticles } from "@/utils/news-transformer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate search keywords environment variable
    const searchKeywords = process.env.NEWSAPI_SEARCH_KEYWORDS;
    if (!searchKeywords) {
      return NextResponse.json(
        { error: "NEWSAPI_SEARCH_KEYWORDS environment variable is not set" },
        { status: 500 },
      );
    }

    // Fetch from NewsAPI
    const newsClient = createNewsAPIClient();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000,).toISOString();

    const response = await newsClient.searchNews(searchKeywords, {
      language: "pt",
      sortBy: "publishedAt",
      pageSize: 20,
      from: sevenDaysAgo,
    });

    if (response.articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new articles found",
        count: 0,
      });
    }

    // Transform articles
    const defaultImage =
      process.env.DEFAULT_NEWS_IMAGE || "/industry-notice.jpg";
    const transformedArticles = transformBatchArticles(
      response.articles,
      defaultImage,
    );

    // Store in MongoDB
    const collection = await getNewsCollection();

    // Use upsert to avoid duplicates based on URL
    const bulkOps = transformedArticles.map((article) => {
      // Remove createdAt and updatedAt from the article to avoid conflict with $setOnInsert
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, updatedAt, ...articleData } = article;

      return {
        updateOne: {
          filter: { url: article.url },
          update: {
            $set: { ...articleData, updatedAt: new Date() },
            $setOnInsert: { createdAt: new Date() },
          },
          upsert: true,
        },
      };
    });

    const result = await collection.bulkWrite(bulkOps);

    // Create indexes if they don't exist
    await collection.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await collection.createIndex({ publishedAt: -1, isActive: 1 });
    await collection.createIndex({ isActive: 1, createdAt: -1 });
    await collection.createIndex(
      { category: 1, isActive: 1, publishedAt: -1 },
      { background: true, name: "category_active_published_idx" },
    );

    return NextResponse.json({
      success: true,
      message: "News fetched and stored successfully",
      count: response.articles.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Cron] Error fetching news:", error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage || "Failed to fetch news",
      },
      { status: 500 },
    );
  }
}
