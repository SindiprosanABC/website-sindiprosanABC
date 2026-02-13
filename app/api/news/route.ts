import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { getNewsCollection } from "@/lib/mongodb";
import type { News } from "@/lib/types/news";
import { authOptions } from "@/lib/auth-options";
import {
  createNewsSchema,
  updateNewsSchema,
  deleteNewsSchema,
} from "@/lib/validations/news";
import { generateSlug } from "@/utils/slug-generator";
import { formatDatePortuguese } from "@/utils/date-formatter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category") || "medicina";
    const all = searchParams.get("all") === "true"; // Admin param to get all articles
    const search = searchParams.get("search"); // Search by title
    const tag = searchParams.get("tag"); // Filter by tag
    const status = searchParams.get("status"); // Filter by status: 'active', 'inactive'

    const collection = await getNewsCollection();

    // Get single article by slug
    if (slug) {
      console.log('[API] Fetching article with slug:', slug);

      const article = await collection.findOne({
        slug,
        ...(all ? {} : { isActive: true }),
      });

      console.log('[API] Article found:', article ? 'yes' : 'no');

      if (!article) {
        console.log('[API] Article not found for slug:', slug);
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

      // Include admin fields if requested
      if (all) {
        return NextResponse.json({
          news: {
            ...news,
            _id: article._id.toString(),
            publishedAt: article.publishedAt,
            isActive: article.isActive,
            description: article.description,
          },
        });
      }

      return NextResponse.json({ news });
    }

    // Get paginated list of articles
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {
      ...(category && { category }),
    };

    // Status filter
    if (all) {
      // Admin view - can filter by specific status
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      }
      // If status === '', show all (active and inactive)
    } else {
      // Public view - always only active
      filter.isActive = true;
    }

    // Search filter (case-insensitive)
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Tag filter
    if (tag) {
      filter.tag = tag;
    }

    const [articles, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    // Transform to News[] type
    const newsList: News[] = articles.map((article) => {
      const news: any = {
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
      };

      // Include admin fields if requested
      if (all) {
        news._id = article._id.toString();
        news.publishedAt = article.publishedAt;
        news.isActive = article.isActive;
        news.description = article.description;
      }

      return news;
    });

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

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createNewsSchema.parse(body);

    // Generate slug from title
    const slug = generateSlug(validatedData.title);

    // Format date in Portuguese
    const formattedDate = formatDatePortuguese(validatedData.publishedAt);

    // Prepare news article document
    const collection = await getNewsCollection();
    const newsArticle = {
      slug,
      title: validatedData.title,
      description: validatedData.description,
      content: validatedData.content,
      bodyText: validatedData.description, // Use description as body text excerpt
      tag: validatedData.tag,
      category: validatedData.category,
      imageSrc: validatedData.imageSrc,
      date: formattedDate,
      publishedAt: validatedData.publishedAt,
      isActive: validatedData.isActive,
      cta: "Saiba mais",
      language: "pt",
      createdBy: new ObjectId(session.user.id),
      updatedBy: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await collection.insertOne(newsArticle);

    return NextResponse.json(
      {
        message: "Notícia criada com sucesso",
        id: result.insertedId.toString(),
        slug,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[API] Error creating news:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar notícia" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateNewsSchema.parse(body);

    const collection = await getNewsCollection();

    // Find existing article
    const existingArticle = await collection.findOne({
      _id: new ObjectId(validatedData._id),
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    // Prepare update document
    const updateDoc: any = {
      updatedBy: new ObjectId(session.user.id),
      updatedAt: new Date(),
    };

    // Update only provided fields
    if (validatedData.title) {
      updateDoc.title = validatedData.title;
      updateDoc.slug = generateSlug(validatedData.title);
    }
    if (validatedData.description) {
      updateDoc.description = validatedData.description;
      updateDoc.bodyText = validatedData.description;
    }
    if (validatedData.content) {
      updateDoc.content = validatedData.content;
    }
    if (validatedData.tag) {
      updateDoc.tag = validatedData.tag;
    }
    if (validatedData.category) {
      updateDoc.category = validatedData.category;
    }
    if (validatedData.imageSrc) {
      updateDoc.imageSrc = validatedData.imageSrc;
    }
    if (validatedData.publishedAt) {
      updateDoc.publishedAt = validatedData.publishedAt;
      updateDoc.date = formatDatePortuguese(validatedData.publishedAt);
    }
    if (validatedData.isActive !== undefined) {
      updateDoc.isActive = validatedData.isActive;
    }

    // Update in database
    await collection.updateOne(
      { _id: new ObjectId(validatedData._id) },
      { $set: updateDoc }
    );

    return NextResponse.json(
      {
        message: "Notícia atualizada com sucesso",
        id: validatedData._id,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[API] Error updating news:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar notícia" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = deleteNewsSchema.parse(body);

    const collection = await getNewsCollection();

    // Hard delete: permanently remove from database
    console.log('[API] Hard deleting news article:', validatedData._id, 'by user:', session.user.id);

    const result = await collection.deleteOne({
      _id: new ObjectId(validatedData._id),
    });

    console.log('[API] News article deleted:', result.deletedCount === 1 ? 'success' : 'failed');

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Notícia excluída com sucesso" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[API] Error deleting news:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao excluir notícia" },
      { status: 500 }
    );
  }
}
