# Documentação Completa do MCP (Painel Admin) - SINDIPROSAN-ABC

## Contexto

Este documento fornece uma documentação completa de como implementar um painel de administração (MCP - Management Control Panel) em um projeto Next.js com:
- Sistema de autenticação com NextAuth.js
- CRUDs completos (Notícias e Tags)
- Integração com MongoDB
- Upload de arquivos
- Editor rich-text
- Validação de dados

Este guia foi criado a partir do projeto SINDIPROSAN-ABC e pode ser replicado em outros projetos de landing pages.

---

## 1. ESTRUTURA DE PASTAS

```
project-root/
├── app/
│   ├── admin/                              # Área administrativa protegida
│   │   ├── layout.tsx                      # Layout com sidebar e navegação
│   │   ├── login/page.tsx                  # Página de login
│   │   ├── dashboard/page.tsx              # Dashboard com estatísticas
│   │   ├── news/
│   │   │   ├── page.tsx                    # Lista de notícias (com filtros)
│   │   │   ├── create/page.tsx             # Criar notícia
│   │   │   └── [slug]/edit/page.tsx        # Editar notícia
│   │   └── tags/
│   │       ├── page.tsx                    # Lista de tags
│   │       ├── create/page.tsx             # Criar tag
│   │       └── [id]/edit/page.tsx          # Editar tag
│   │
│   ├── (public)/                           # Área pública (opcional)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── noticias/[slug]/page.tsx        # Detalhe de notícia
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts     # NextAuth configuração
│       ├── news/
│       │   ├── route.ts                    # CRUD de notícias
│       │   └── stats/route.ts              # Estatísticas
│       ├── tags/route.ts                   # CRUD de tags
│       └── upload/route.ts                 # Upload de arquivos
│
├── lib/
│   ├── mongodb.ts                          # Conexão com MongoDB
│   ├── auth.ts                             # Funções de hash de senha
│   ├── upload.ts                           # Lógica de upload
│   ├── types/
│   │   ├── news.ts                         # Tipos do News
│   │   └── tags.ts                         # Tipos das Tags
│   ├── validations/
│   │   ├── news.ts                         # Schemas Zod para News
│   │   └── tags.ts                         # Schemas Zod para Tags
│   └── utils/
│       └── slug.ts                         # Geração de slugs
│
├── components/
│   ├── providers/
│   │   └── session-provider.tsx            # Provider do NextAuth
│   ├── editor/
│   │   └── tiptap-editor.tsx               # Editor rich-text
│   ├── ui/                                 # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── pagination.tsx
│   └── sections/
│       └── latestNews.tsx                  # Componente público de notícias
│
├── middleware.ts                           # Proteção de rotas admin
├── .env.local                              # Variáveis de ambiente
└── package.json
```

---

## 2. CONFIGURAÇÃO DO BANCO DE DADOS

### 2.1. Instalar Dependências

```bash
npm install mongodb
```

### 2.2. Variáveis de Ambiente (.env.local)

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/
MONGODB_DB_NAME=seu_database
NEXTAUTH_SECRET=sua_chave_secreta_aqui
NEXTAUTH_URL=http://localhost:3000
```

### 2.3. Conexão com MongoDB (lib/mongodb.ts)

```typescript
import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor adicione MONGODB_URI no .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'database';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // Retorna conexão cacheada se existir
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Nova conexão
  const client = await MongoClient.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 10000,
  });

  const db = client.db(dbName);

  // Armazena no cache
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Funções helper para acessar collections
export async function getNewsCollection() {
  const { db } = await connectToDatabase();
  return db.collection('news_articles');
}

export async function getTagsCollection() {
  const { db } = await connectToDatabase();
  return db.collection('news_tags');
}

export async function getAdminUsersCollection() {
  const { db } = await connectToDatabase();
  return db.collection('admin_users');
}
```

### 2.4. Modelos de Dados (lib/types/)

#### Tags (lib/types/tags.ts)

```typescript
export interface Tag {
  name: string;
  slug: string;
  color: string;              // Hex color (#RRGGBB)
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;          // ObjectId do usuário
  updatedBy: string;
}

export interface TagDocument extends Tag {
  _id: string;
}
```

#### News (lib/types/news.ts)

```typescript
export type News = {
  slug: string;
  imageSrc: string;
  tag: string;                // Nome da tag
  date: string;               // Data formatada em português
  title: string;
  bodyText: string;           // Descrição/resumo
  content: string;            // Conteúdo HTML completo
  category: string;
  isActive?: boolean;
  publishedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
};
```

---

## 3. SISTEMA DE AUTENTICAÇÃO

### 3.1. Instalar Dependências

```bash
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

### 3.2. Configuração do NextAuth (app/api/auth/[...nextauth]/route.ts)

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getAdminUsersCollection } from '@/lib/mongodb';
import { verifyPassword } from '@/lib/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        const adminsCollection = await getAdminUsersCollection();
        const user = await adminsCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error('Credenciais inválidas');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Credenciais inválidas');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 3.3. Funções de Hash de Senha (lib/auth.ts)

```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
```

### 3.4. Middleware de Proteção (middleware.ts)

```typescript
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protege rotas /admin (exceto /admin/login)
        if (req.nextUrl.pathname.startsWith('/admin')) {
          if (req.nextUrl.pathname === '/admin/login') {
            return true;
          }
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
```

### 3.5. Session Provider (components/providers/session-provider.tsx)

```typescript
'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 3.6. Integrar no Layout Principal (app/layout.tsx)

```typescript
import { AuthProvider } from '@/components/providers/session-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 3.7. Página de Login (app/admin/login/page.tsx)

```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type LoginFormData = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      } else if (result?.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold">Painel Admin</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login para acessar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              type="email"
              className="mt-1 w-full rounded-lg border p-2"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <input
              {...register('password', { required: 'Senha é obrigatória' })}
              type="password"
              className="mt-1 w-full rounded-lg border p-2"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## 4. LAYOUT ADMIN COM SIDEBAR

### 4.1. Layout Admin (app/admin/layout.tsx)

```typescript
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, LayoutDashboard, Newspaper, Tag, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/news', label: 'Notícias', icon: Newspaper },
    { href: '/admin/tags', label: 'Tags', icon: Tag },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col bg-[#2e4b89] text-white lg:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="text-sm font-medium">{session?.user?.name || 'Admin'}</p>
          <p className="text-xs text-white/70">{session?.user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed right-4 top-4 z-50 rounded-lg bg-blue-600 p-2 text-white"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-[#2e4b89] text-white">
            <nav className="mt-16 space-y-1 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white/10"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
    </div>
  );
}
```

---

## 5. VALIDAÇÃO DE DADOS COM ZOD

### 5.1. Instalar Zod

```bash
npm install zod
```

### 5.2. Schemas de Validação para News (lib/validations/news.ts)

```typescript
import { z } from 'zod';

export const createNewsSchema = z.object({
  title: z
    .string()
    .min(10, 'Título deve ter pelo menos 10 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  description: z
    .string()
    .min(20, 'Descrição deve ter pelo menos 20 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  content: z.string().min(50, 'Conteúdo deve ter pelo menos 50 caracteres'),
  tag: z.string().min(1, 'Selecione uma tag'),
  category: z.string().default('medicina'),
  imageSrc: z.string().min(1, 'Imagem é obrigatória'),
  publishedAt: z.coerce.date(),
  isActive: z.boolean().default(true),
});

export const updateNewsSchema = z.object({
  _id: z.string().min(1),
  title: z.string().min(10).max(200).optional(),
  description: z.string().min(20).max(500).optional(),
  content: z.string().min(50).optional(),
  tag: z.string().optional(),
  category: z.string().optional(),
  imageSrc: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export const deleteNewsSchema = z.object({
  _id: z.string().min(1),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type DeleteNewsInput = z.infer<typeof deleteNewsSchema>;
```

### 5.3. Schemas de Validação para Tags (lib/validations/tags.ts)

```typescript
import { z } from 'zod';

export const createTagSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .refine((val) => val.trim().length > 0, 'Nome não pode ser vazio'),
  slug: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (#RRGGBB)'),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  order: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
});

export const updateTagSchema = z.object({
  _id: z.string().min(1),
  name: z.string().min(3).max(50).optional(),
  slug: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  description: z.string().max(200).optional(),
  order: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const deleteTagSchema = z.object({
  _id: z.string().min(1),
  force: z.boolean().optional(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type DeleteTagInput = z.infer<typeof deleteTagSchema>;
```

---

## 6. API ROUTES - CRUD DE NOTÍCIAS

### 6.1. API de Notícias (app/api/news/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getNewsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { generateSlug } from '@/lib/utils/slug';
import {
  createNewsSchema,
  updateNewsSchema,
  deleteNewsSchema,
} from '@/lib/validations/news';

// GET - Listar notícias (pública ou admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const slug = searchParams.get('slug');
    const all = searchParams.get('all') === 'true';
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const status = searchParams.get('status') || '';

    const collection = await getNewsCollection();
    const filter: any = {};

    // Filtro por slug
    if (slug) {
      filter.slug = slug;
    }

    // Filtro por busca de título
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Filtro por tag
    if (tag) {
      filter.tag = tag;
    }

    // Filtro por status (apenas admin)
    if (all) {
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      }
    } else {
      filter.isActive = true; // Apenas ativos na view pública
    }

    const skip = (page - 1) * limit;
    const total = await collection.countDocuments(filter);

    const news = await collection
      .find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar notícias' },
      { status: 500 }
    );
  }
}

// POST - Criar notícia (protegido)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createNewsSchema.parse(body);

    const collection = await getNewsCollection();

    const slug = generateSlug(validated.title);
    const date = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(validated.publishedAt));

    const newsData = {
      ...validated,
      slug,
      date,
      bodyText: validated.description,
      cta: 'Saiba mais',
      url: `/noticias/${slug}`,
      createdBy: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newsData);

    return NextResponse.json({
      id: result.insertedId.toString(),
      slug,
      message: 'Notícia criada com sucesso',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro ao criar notícia:', error);
    return NextResponse.json(
      { error: 'Erro ao criar notícia' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar notícia (protegido)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateNewsSchema.parse(body);

    const collection = await getNewsCollection();
    const { _id, ...updateData } = validated;

    // Regenera slug se título mudou
    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    // Regenera data se publishedAt mudou
    if (updateData.publishedAt) {
      updateData.date = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(updateData.publishedAt));
    }

    updateData.updatedBy = new ObjectId(session.user.id);
    updateData.updatedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Notícia atualizada com sucesso' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro ao atualizar notícia:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar notícia' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar notícia (soft delete - protegido)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const validated = deleteNewsSchema.parse(body);

    const collection = await getNewsCollection();

    // Soft delete: marca como inativa ao invés de deletar
    const result = await collection.updateOne(
      { _id: new ObjectId(validated._id) },
      {
        $set: {
          isActive: false,
          updatedBy: new ObjectId(session.user.id),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Notícia excluída com sucesso' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro ao excluir notícia:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir notícia' },
      { status: 500 }
    );
  }
}
```

### 6.2. API de Estatísticas (app/api/news/stats/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getNewsCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const collection = await getNewsCollection();

    const total = await collection.countDocuments({});
    const active = await collection.countDocuments({ isActive: true });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonth = await collection.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    return NextResponse.json({
      total,
      active,
      thisMonth,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
```

---

## 7. API ROUTES - CRUD DE TAGS

### 7.1. API de Tags (app/api/tags/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getTagsCollection, getNewsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { generateSlug } from '@/lib/utils/slug';
import {
  createTagSchema,
  updateTagSchema,
  deleteTagSchema,
} from '@/lib/validations/tags';

// GET - Listar tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const all = searchParams.get('all') === 'true';
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const collection = await getTagsCollection();
    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (activeOnly) {
      filter.isActive = true;
    } else if (all && status) {
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      }
    } else if (!all) {
      filter.isActive = true;
    }

    const skip = (page - 1) * limit;
    const total = await collection.countDocuments(filter);

    const tags = await collection
      .find(filter)
      .sort({ order: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      tags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    return NextResponse.json({ error: 'Erro ao buscar tags' }, { status: 500 });
  }
}

// POST - Criar tag (protegido)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createTagSchema.parse(body);

    const collection = await getTagsCollection();

    const slug = validated.slug || generateSlug(validated.name);

    // Verifica duplicatas
    const existing = await collection.findOne({
      $or: [{ name: validated.name }, { slug }],
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Uma tag com este nome já existe' },
        { status: 409 }
      );
    }

    // Auto-atribui ordem se não fornecida
    let order = validated.order;
    if (!order) {
      const lastTag = await collection
        .find({})
        .sort({ order: -1 })
        .limit(1)
        .toArray();
      order = lastTag.length > 0 ? (lastTag[0].order || 0) + 1 : 1;
    }

    const tagData = {
      ...validated,
      slug,
      order,
      createdBy: new ObjectId(session.user.id),
      updatedBy: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(tagData);

    return NextResponse.json({
      id: result.insertedId.toString(),
      slug,
      message: 'Tag criada com sucesso',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro ao criar tag:', error);
    return NextResponse.json({ error: 'Erro ao criar tag' }, { status: 500 });
  }
}

// PUT - Atualizar tag (protegido)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateTagSchema.parse(body);

    const collection = await getTagsCollection();
    const { _id, ...updateData } = validated;

    const existing = await collection.findOne({ _id: new ObjectId(_id) });

    if (!existing) {
      return NextResponse.json({ error: 'Tag não encontrada' }, { status: 404 });
    }

    let updatedNewsCount = 0;

    // Se o nome mudou, atualiza slug e todas as notícias que usam essa tag
    if (updateData.name && updateData.name !== existing.name) {
      updateData.slug = generateSlug(updateData.name);

      // Verifica duplicata
      const duplicate = await collection.findOne({
        _id: { $ne: new ObjectId(_id) },
        $or: [{ name: updateData.name }, { slug: updateData.slug }],
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Uma tag com este nome já existe' },
          { status: 409 }
        );
      }

      // Atualiza notícias que usam a tag antiga
      const newsCollection = await getNewsCollection();
      const result = await newsCollection.updateMany(
        { tag: existing.name },
        { $set: { tag: updateData.name } }
      );

      updatedNewsCount = result.modifiedCount;
    }

    updateData.updatedBy = new ObjectId(session.user.id);
    updateData.updatedAt = new Date();

    await collection.updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

    return NextResponse.json({
      message: 'Tag atualizada com sucesso',
      updatedNewsCount,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro ao atualizar tag:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar tag' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar tag (soft delete - protegido)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const validated = deleteTagSchema.parse(body);

    const collection = await getTagsCollection();
    const tag = await collection.findOne({ _id: new ObjectId(validated._id) });

    if (!tag) {
      return NextResponse.json({ error: 'Tag não encontrada' }, { status: 404 });
    }

    // Impede exclusão da última tag ativa
    const activeCount = await collection.countDocuments({ isActive: true });
    if (activeCount === 1 && tag.isActive) {
      return NextResponse.json(
        { error: 'Não é possível excluir a última tag ativa' },
        { status: 400 }
      );
    }

    // Verifica uso em notícias
    const newsCollection = await getNewsCollection();
    const usageCount = await newsCollection.countDocuments({ tag: tag.name });

    if (usageCount > 0 && !validated.force) {
      return NextResponse.json(
        {
          error: 'Tag em uso',
          inUse: true,
          count: usageCount,
          message: `Esta tag é usada em ${usageCount} notícia(s). Deseja forçar a exclusão?`,
        },
        { status: 409 }
      );
    }

    // Soft delete
    await collection.updateOne(
      { _id: new ObjectId(validated._id) },
      {
        $set: {
          isActive: false,
          updatedBy: new ObjectId(session.user.id),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: 'Tag excluída com sucesso',
      articlesAffected: usageCount,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erro ao excluir tag:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir tag' },
      { status: 500 }
    );
  }
}
```

---

## 8. UPLOAD DE ARQUIVOS

### 8.1. Instalar Dependência

```bash
npm install sharp  # Para otimização de imagens (opcional)
```

### 8.2. Utility de Upload (lib/upload.ts)

```typescript
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'news');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export interface UploadResult {
  url: string;
  filename: string;
}

export interface UploadError {
  error: string;
}

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return `Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
  }

  return null;
}

export function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop() || 'jpg';
  return `${timestamp}-${randomString}.${extension}`;
}

export async function saveUploadedFile(
  file: File
): Promise<UploadResult | UploadError> {
  // Validação
  const validationError = validateFile(file);
  if (validationError) {
    return { error: validationError };
  }

  // Gera nome único
  const filename = generateFilename(file.name);
  const filePath = join(UPLOAD_DIR, filename);

  // Salva arquivo
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);

  return {
    url: `/uploads/news/${filename}`,
    filename,
  };
}

// Opcional: Função para deletar arquivo
export async function deleteUploadedFile(filename: string): Promise<void> {
  const filePath = join(UPLOAD_DIR, filename);
  const { unlink } = await import('fs/promises');
  await unlink(filePath);
}
```

### 8.3. API de Upload (app/api/upload/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { saveUploadedFile } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo fornecido' },
        { status: 400 }
      );
    }

    const result = await saveUploadedFile(file);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}
```

---

## 9. EDITOR RICH-TEXT (TIPTAP)

### 9.1. Instalar Dependências

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link
```

### 9.2. Componente do Editor (components/editor/tiptap-editor.tsx)

```typescript
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({
  value,
  onChange,
  placeholder = 'Escreva o conteúdo aqui...',
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] max-h-[600px] overflow-y-auto p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b bg-gray-50 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
          title="Negrito (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
          title="Itálico (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bulletList') ? 'bg-gray-200' : ''
          }`}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('orderedList') ? 'bg-gray-200' : ''
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('link') ? 'bg-gray-200' : ''
          }`}
          title="Adicionar link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Desfazer"
        >
          <Undo className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Refazer"
        >
          <Redo className="h-4 w-4" />
        </button>

        <div className="ml-auto text-sm text-gray-500">
          {editor.storage.characterCount?.characters() || 0} caracteres
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
```

---

## 10. UTILITIES

### 10.1. Geração de Slugs (lib/utils/slug.ts)

```typescript
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normaliza para decompor acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
    .replace(/[^a-z0-9]+/g, '-') // Substitui não-alfanuméricos por hífens
    .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim
}

// Exemplos:
// generateSlug('Nova Tecnologia') → 'nova-tecnologia'
// generateSlug('São Paulo') → 'sao-paulo'
// generateSlug('COVID-19 Update') → 'covid-19-update'
```

---

## 11. PÁGINAS ADMIN - DASHBOARD

### 11.1. Dashboard com Estatísticas (app/admin/dashboard/page.tsx)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Newspaper, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  total: number;
  active: number;
  thisMonth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/news/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Visão geral do painel administrativo
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Notícias
              </p>
              <p className="mt-2 text-3xl font-bold">{stats?.total || 0}</p>
            </div>
            <Newspaper className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Notícias Ativas
              </p>
              <p className="mt-2 text-3xl font-bold">{stats?.active || 0}</p>
            </div>
            <Eye className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Este Mês</p>
              <p className="mt-2 text-3xl font-bold">{stats?.thisMonth || 0}</p>
            </div>
            <Calendar className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/news/create"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Nova Notícia
          </Link>
          <Link
            href="/admin/news"
            className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-50"
          >
            Ver Todas as Notícias
          </Link>
          <Link
            href="/admin/tags/create"
            className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-50"
          >
            Nova Tag
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 12. PÁGINAS ADMIN - LISTA DE NOTÍCIAS

### 12.1. Lista com Filtros (app/admin/news/page.tsx)

```typescript
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface NewsArticle {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tag: string;
  imageSrc: string;
  date: string;
  publishedAt: string;
  isActive: boolean;
}

interface Tag {
  _id: string;
  name: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [status, setStatus] = useState('');

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [currentPage, search, selectedTag, status]);

  async function fetchTags() {
    try {
      const response = await fetch('/api/tags?activeOnly=true');
      const data = await response.json();
      setTags(data.tags || []);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    }
  }

  async function fetchNews() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        all: 'true',
        ...(search && { search }),
        ...(selectedTag && { tag: selectedTag }),
        ...(status && { status }),
      });

      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();

      setNews(data.news || []);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const response = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: id,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  }

  async function deleteNews(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) {
      return;
    }

    try {
      const response = await fetch('/api/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });

      if (response.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notícias</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie as notícias do site
          </p>
        </div>
        <Link
          href="/admin/news/create"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nova Notícia
        </Link>
      </div>

      {/* Filtros */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Buscar por título
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Digite para buscar..."
                className="w-full rounded-lg border pl-10 pr-4 py-2"
              />
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium mb-1">Tag</label>
            <select
              value={selectedTag}
              onChange={(e) => {
                setSelectedTag(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border px-4 py-2"
            >
              <option value="">Todas as tags</option>
              {tags.map((tag) => (
                <option key={tag._id} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border px-4 py-2"
            >
              <option value="">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div>Carregando...</div>
      ) : news.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Nenhuma notícia encontrada</p>
        </div>
      ) : (
        <>
          {/* Cards (Mobile) */}
          <div className="grid gap-4 md:hidden">
            {news.map((article) => (
              <div
                key={article._id}
                className="rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <Image
                    src={article.imageSrc}
                    alt={article.title}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{article.tag}</p>
                    <p className="text-xs text-gray-500">{article.date}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(article._id, article.isActive)}
                    className="rounded p-2 hover:bg-gray-100"
                    title={article.isActive ? 'Desativar' : 'Ativar'}
                  >
                    {article.isActive ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <Link
                    href={`/admin/news/${article.slug}/edit`}
                    className="rounded p-2 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Link>
                  <button
                    onClick={() => deleteNews(article._id)}
                    className="rounded p-2 hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tabela (Desktop) */}
          <div className="hidden md:block rounded-lg bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Imagem
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Tag
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {news.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Image
                        src={article.imageSrc}
                        alt={article.title}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium line-clamp-2">{article.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
                        {article.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {article.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          article.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {article.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(article._id, article.isActive)}
                          className="rounded p-2 hover:bg-gray-100"
                        >
                          {article.isActive ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <Link
                          href={`/admin/news/${article.slug}/edit`}
                          className="rounded p-2 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => deleteNews(article._id)}
                          className="rounded p-2 hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border px-4 py-2 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border px-4 py-2 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

## 13. PÁGINAS ADMIN - CRIAR/EDITAR NOTÍCIA

### 13.1. Formulário de Criação (app/admin/news/create/page.tsx)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import TipTapEditor from '@/components/editor/tiptap-editor';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsFormData {
  title: string;
  description: string;
  tag: string;
  publishedAt: string;
  isActive: boolean;
}

interface Tag {
  _id: string;
  name: string;
}

export default function CreateNewsPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsFormData>({
    defaultValues: {
      isActive: true,
      publishedAt: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/tags?activeOnly=true');
        const data = await response.json();
        setTags(data.tags || []);
      } catch (error) {
        console.error('Erro ao carregar tags:', error);
      }
    }
    fetchTags();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2MB');
      return;
    }

    setImageFile(file);
    setError('');

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(data: NewsFormData) {
    if (!imageFile) {
      setError('Por favor, selecione uma imagem');
      return;
    }

    if (!content || content.trim().length < 50) {
      setError('O conteúdo deve ter pelo menos 50 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Upload da imagem
      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const { url: imageSrc } = await uploadResponse.json();

      // 2. Criar notícia
      const newsResponse = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          content,
          imageSrc,
          category: 'medicina',
        }),
      });

      if (!newsResponse.ok) {
        const errorData = await newsResponse.json();
        throw new Error(errorData.error || 'Erro ao criar notícia');
      }

      router.push('/admin/news');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/news"
          className="rounded-lg border p-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nova Notícia</h1>
          <p className="mt-1 text-sm text-gray-600">
            Preencha os dados da notícia
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow-sm space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Título <span className="text-red-600">*</span>
            </label>
            <input
              {...register('title', {
                required: 'Título é obrigatório',
                minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                maxLength: { value: 200, message: 'Máximo 200 caracteres' },
              })}
              type="text"
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Digite o título da notícia"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição <span className="text-red-600">*</span>
            </label>
            <textarea
              {...register('description', {
                required: 'Descrição é obrigatória',
                minLength: { value: 20, message: 'Mínimo 20 caracteres' },
                maxLength: { value: 500, message: 'Máximo 500 caracteres' },
              })}
              rows={3}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Breve resumo da notícia"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Conteúdo <span className="text-red-600">*</span>
            </label>
            <TipTapEditor
              value={content}
              onChange={setContent}
              placeholder="Escreva o conteúdo completo da notícia..."
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tag <span className="text-red-600">*</span>
            </label>
            <select
              {...register('tag', { required: 'Tag é obrigatória' })}
              className="w-full rounded-lg border px-4 py-2"
            >
              <option value="">Selecione uma tag</option>
              {tags.map((tag) => (
                <option key={tag._id} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
            {errors.tag && (
              <p className="mt-1 text-sm text-red-600">{errors.tag.message}</p>
            )}
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Imagem <span className="text-red-600">*</span>
            </label>
            <div className="flex items-start gap-4">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-6 py-4 hover:border-blue-500">
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {imageFile ? imageFile.name : 'Selecionar imagem'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Formatos: JPG, PNG, WebP. Máximo 2MB.
            </p>
          </div>

          {/* Data de Publicação */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Data de Publicação <span className="text-red-600">*</span>
            </label>
            <input
              {...register('publishedAt', { required: 'Data é obrigatória' })}
              type="date"
              className="w-full rounded-lg border px-4 py-2"
            />
            {errors.publishedAt && (
              <p className="mt-1 text-sm text-red-600">
                {errors.publishedAt.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              {...register('isActive')}
              type="checkbox"
              id="isActive"
              className="h-4 w-4"
            />
            <label htmlFor="isActive" className="text-sm">
              Publicar imediatamente (visível no site)
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Criando...' : 'Criar Notícia'}
          </button>
          <Link
            href="/admin/news"
            className="rounded-lg border px-6 py-3 hover:bg-gray-50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
```

---

## 14. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Setup Inicial
- [ ] Criar estrutura de pastas
- [ ] Instalar dependências (next-auth, mongodb, zod, bcryptjs, tiptap, react-hook-form)
- [ ] Configurar variáveis de ambiente (.env.local)
- [ ] Configurar conexão com MongoDB (lib/mongodb.ts)

### Fase 2: Autenticação
- [ ] Criar funções de hash (lib/auth.ts)
- [ ] Configurar NextAuth (app/api/auth/[...nextauth]/route.ts)
- [ ] Criar SessionProvider (components/providers/session-provider.tsx)
- [ ] Integrar SessionProvider no layout principal
- [ ] Criar middleware de proteção (middleware.ts)
- [ ] Criar página de login (app/admin/login/page.tsx)
- [ ] Criar primeiro usuário admin no MongoDB

### Fase 3: Modelos e Validação
- [ ] Criar tipos para News (lib/types/news.ts)
- [ ] Criar tipos para Tags (lib/types/tags.ts)
- [ ] Criar schemas Zod para News (lib/validations/news.ts)
- [ ] Criar schemas Zod para Tags (lib/validations/tags.ts)
- [ ] Criar utility de slugs (lib/utils/slug.ts)

### Fase 4: APIs
- [ ] Criar API de News (app/api/news/route.ts)
- [ ] Criar API de Stats (app/api/news/stats/route.ts)
- [ ] Criar API de Tags (app/api/tags/route.ts)
- [ ] Criar utility de upload (lib/upload.ts)
- [ ] Criar API de Upload (app/api/upload/route.ts)
- [ ] Criar pasta public/uploads/news/

### Fase 5: Componentes
- [ ] Criar TipTap Editor (components/editor/tiptap-editor.tsx)
- [ ] Instalar e configurar shadcn/ui components necessários
- [ ] Criar componente de Paginação (opcional)

### Fase 6: Área Admin
- [ ] Criar Layout Admin com sidebar (app/admin/layout.tsx)
- [ ] Criar Dashboard (app/admin/dashboard/page.tsx)
- [ ] Criar Lista de Notícias (app/admin/news/page.tsx)
- [ ] Criar Criar Notícia (app/admin/news/create/page.tsx)
- [ ] Criar Editar Notícia (app/admin/news/[slug]/edit/page.tsx)
- [ ] Criar Lista de Tags (app/admin/tags/page.tsx)
- [ ] Criar Criar Tag (app/admin/tags/create/page.tsx)
- [ ] Criar Editar Tag (app/admin/tags/[id]/edit/page.tsx)

### Fase 7: Área Pública (Opcional)
- [ ] Criar layout público
- [ ] Criar página de listagem de notícias
- [ ] Criar página de detalhe de notícia
- [ ] Criar componentes de seção (latestNews, etc)

### Fase 8: Testes e Refinamentos
- [ ] Testar fluxo de login/logout
- [ ] Testar CRUD de notícias completo
- [ ] Testar CRUD de tags completo
- [ ] Testar upload de imagens
- [ ] Testar validações e erros
- [ ] Testar responsividade mobile/desktop
- [ ] Testar proteção de rotas
- [ ] Otimizar performance de queries

---

## 15. DEPENDÊNCIAS NECESSÁRIAS

### package.json (Principais)

```json
{
  "dependencies": {
    "next": "^15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "mongodb": "^6.9.0",
    "next-auth": "^4.24.13",
    "bcryptjs": "^3.0.3",
    "zod": "^4.3.6",
    "@tiptap/react": "^3.19.0",
    "@tiptap/starter-kit": "^3.19.0",
    "@tiptap/extension-link": "^3.19.0",
    "react-hook-form": "^7.60.0",
    "@hookform/resolvers": "^3.9.1",
    "lucide-react": "^0.511.0",
    "tailwindcss": "^4",
    "sharp": "^0.33.5"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/bcryptjs": "^2.4.6",
    "typescript": "^5"
  }
}
```

---

## 16. CONSIDERAÇÕES FINAIS

### Segurança
- Sempre valide dados no servidor (nunca confie apenas em validação client-side)
- Use HTTPS em produção
- Mantenha NEXTAUTH_SECRET seguro e único
- Implemente rate limiting em produção
- Sanitize inputs HTML para prevenir XSS
- Use prepared statements (MongoDB já faz isso automaticamente)

### Performance
- Implemente paginação em todas as listagens
- Use índices no MongoDB (name, slug, isActive, publishedAt)
- Considere cache para dados estáticos
- Otimize imagens com Sharp ou next/image

### Escalabilidade
- Considere mover uploads para cloud storage (S3, Cloudinary)
- Implemente soft deletes ao invés de hard deletes
- Mantenha auditoria (createdBy, updatedBy, timestamps)
- Use transações MongoDB para operações críticas

### UX
- Sempre forneça feedback visual (loading, success, error)
- Implemente confirmações para ações destrutivas
- Use toasts para notificações não-intrusivas
- Mantenha formulários com validação em tempo real

---

## 17. REFERÊNCIAS E RECURSOS

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Zod Documentation](https://zod.dev)
- [TipTap Editor](https://tiptap.dev)
- [React Hook Form](https://react-hook-form.com)
- [shadcn/ui Components](https://ui.shadcn.com)

---

**Documentação gerada a partir do projeto SINDIPROSAN-ABC**
**Data:** 2026-02-10
**Versão:** 1.0
