import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { getTagsCollection, getNewsCollection } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth-options';
import {
  createTagSchema,
  updateTagSchema,
  deleteTagSchema,
} from '@/lib/validations/tags';
import { generateSlug } from '@/lib/utils/slug';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper to serialize MongoDB document
function serializeTag(doc: any) {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    color: doc.color,
    description: doc.description,
    order: doc.order,
    isActive: doc.isActive,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// GET: List all tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true'; // Admin view
    const activeOnly = searchParams.get('activeOnly') === 'true'; // Public view
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search'); // Search by name
    const status = searchParams.get('status'); // Filter by status: 'active', 'inactive'

    const collection = await getTagsCollection();

    // Build filter object
    const filter: any = {};

    // Status filter
    if (all) {
      // Admin view - can filter by specific status
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      }
      // If status === '', show all
    } else if (activeOnly) {
      // Public view
      filter.isActive = true;
    }

    // Search filter (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [tags, total] = await Promise.all([
      collection
        .find(filter)
        .sort({ order: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    return NextResponse.json({
      tags: tags.map(serializeTag),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar tags' },
      { status: 500 }
    );
  }
}

// POST: Create new tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createTagSchema.parse(body);

    const collection = await getTagsCollection();

    // Generate slug from name
    const slug = generateSlug(validated.name);

    // Check for duplicate name or slug
    const existing = await collection.findOne({
      $or: [{ name: validated.name }, { slug }],
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Uma tag com este nome já existe' },
        { status: 409 }
      );
    }

    // Auto-assign order if not provided
    const maxOrderDoc = await collection.findOne(
      {},
      { sort: { order: -1 }, projection: { order: 1 } }
    );
    const order = validated.order ?? (maxOrderDoc?.order ?? 0) + 1;

    // Insert tag
    const result = await collection.insertOne({
      name: validated.name,
      slug,
      color: validated.color,
      description: validated.description,
      order,
      isActive: validated.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: new ObjectId(session.user.id),
      updatedBy: new ObjectId(session.user.id),
    });

    return NextResponse.json({
      message: 'Tag criada com sucesso',
      id: result.insertedId.toString(),
      slug,
    });
  } catch (error: any) {
    console.error('Error creating tag:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao criar tag' },
      { status: 500 }
    );
  }
}

// PUT: Update existing tag
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateTagSchema.parse(body);

    const collection = await getTagsCollection();
    const newsCollection = await getNewsCollection();

    // Find existing tag
    const existing = await collection.findOne({
      _id: new ObjectId(validated._id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      );
    }

    // Prepare updates
    const updates: any = {
      updatedAt: new Date(),
      updatedBy: new ObjectId(session.user.id),
    };

    if (validated.name !== undefined) updates.name = validated.name;
    if (validated.color !== undefined) updates.color = validated.color;
    if (validated.description !== undefined)
      updates.description = validated.description;
    if (validated.order !== undefined) updates.order = validated.order;
    if (validated.isActive !== undefined) updates.isActive = validated.isActive;

    // If name changed, update slug and cascade to news articles
    let updatedNewsCount = 0;
    if (validated.name && validated.name !== existing.name) {
      updates.slug = generateSlug(validated.name);

      // Check if new name already exists
      const duplicate = await collection.findOne({
        name: validated.name,
        _id: { $ne: new ObjectId(validated._id) },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Uma tag com este nome já existe' },
          { status: 409 }
        );
      }

      // Update all news articles with old tag name
      const result = await newsCollection.updateMany(
        { tag: existing.name },
        { $set: { tag: validated.name } }
      );
      updatedNewsCount = result.modifiedCount;
    }

    // Update tag
    await collection.updateOne(
      { _id: new ObjectId(validated._id) },
      { $set: updates }
    );

    return NextResponse.json({
      message: 'Tag atualizada com sucesso',
      ...(updatedNewsCount > 0 && { updatedNewsCount }),
    });
  } catch (error: any) {
    console.error('Error updating tag:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao atualizar tag' },
      { status: 500 }
    );
  }
}

// DELETE: Soft delete tag
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validated = deleteTagSchema.parse(body);

    const collection = await getTagsCollection();
    const newsCollection = await getNewsCollection();

    // Find tag
    const tag = await collection.findOne({ _id: new ObjectId(validated._id) });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      );
    }

    // Check if it's the last active tag
    const activeCount = await collection.countDocuments({ isActive: true });
    if (activeCount === 1 && tag.isActive) {
      return NextResponse.json(
        {
          error: 'Não é possível excluir a última tag ativa',
          message:
            'Deve existir pelo menos uma tag ativa no sistema. Crie outra tag antes de excluir esta.',
        },
        { status: 400 }
      );
    }

    // Check usage in news articles
    const usageCount = await newsCollection.countDocuments({ tag: tag.name });

    if (usageCount > 0 && !validated.force) {
      return NextResponse.json(
        {
          error: 'Tag em uso',
          inUse: true,
          count: usageCount,
          message: `Esta tag é usada em ${usageCount} notícia(s). Tem certeza que deseja excluir?`,
        },
        { status: 409 }
      );
    }

    // Hard delete: permanently remove from database
    console.log('[API] Hard deleting tag:', validated._id, 'by user:', session.user.id, validated.force ? '(forced)' : '');

    const result = await collection.deleteOne({
      _id: new ObjectId(validated._id),
    });

    console.log('[API] Tag deleted:', result.deletedCount === 1 ? 'success' : 'failed');

    return NextResponse.json({
      message: 'Tag excluída com sucesso',
      ...(usageCount > 0 && { articlesAffected: usageCount }),
    });
  } catch (error: any) {
    console.error('Error deleting tag:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao excluir tag' },
      { status: 500 }
    );
  }
}
