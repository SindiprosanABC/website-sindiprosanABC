# Guia Completo de Replicação do Sistema de Notícias

## 📋 Índice

1. [Introdução](#introdução)
2. [Configuração do Ambiente](#configuração-do-ambiente)
3. [Implementação Passo-a-Passo](#implementação-passo-a-passo)
4. [Guia de Customização](#guia-de-customização)
5. [Referência Rápida](#referência-rápida)

---

## Introdução

### Visão Geral do Sistema

Este sistema automatiza a coleta, processamento e exibição de notícias de qualquer categoria temática. Ele foi projetado para permitir que múltiplos projetos compartilhem o mesmo banco de dados MongoDB, diferenciando notícias por categoria.

### Arquitetura Completa

```
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL CRON JOB                         │
│                  (Executa diariamente às 6h)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              /api/cron/fetch-news (GET)                     │
│  • Valida token de segurança (CRON_SECRET)                  │
│  • Lê palavras-chave de busca (NEWSAPI_SEARCH_KEYWORDS)     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   NewsAPI Client                            │
│  Endpoint: https://newsapi.org/v2/everything                │
│  • Query: palavras-chave configuradas                       │
│  • Language: pt (Português)                                 │
│  • Sort: publishedAt (mais recentes primeiro)               │
│  • PageSize: 20 artigos                                     │
│  • From: Últimos 7 dias                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Transformation Pipeline                   │
│  • Gera slugs únicos (título + data)                        │
│  • Determina tags por matching de keywords                  │
│  • Formata datas para português                             │
│  • Aplica imagem padrão se necessário                       │
│  • Define categoria (ex: "medicina", "tecnologia")          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Bulk Write (Upsert)                    │
│  • Previne duplicatas usando URL como chave única           │
│  • Insere novos artigos                                     │
│  • Atualiza artigos existentes                              │
│  • Cria índices otimizados                                  │
│  Collection: news_articles                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API de Leitura                           │
│              GET /api/news?category=medicina                │
│  • Paginação (limit, page)                                  │
│  • Filtro por categoria                                     │
│  • Busca por slug específico                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Componente Frontend (React)                   │
│  • Fetch client-side com useEffect                          │
│  • Estados de loading/error                                 │
│  • Renderização em carousel                                 │
│  • Links externos para artigos originais                    │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados End-to-End

```
NewsAPI → Transform → MongoDB → API Route → Frontend Component → User
```

---

## Configuração do Ambiente

### Variáveis de Ambiente (.env.local)

Crie um arquivo `.env.local` na raiz do seu projeto:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=news_system

# NewsAPI
NEWSAPI_KEY=sua_chave_newsapi_aqui
NEWSAPI_SEARCH_KEYWORDS=medicina farmacêutica saúde

# Segurança do Cron
CRON_SECRET=seu_token_secreto_aleatorio_aqui

# Opcional
DEFAULT_NEWS_IMAGE=/industry-notice.jpg
```

### Descrição das Variáveis

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `MONGODB_URI` | String de conexão do MongoDB Atlas | `mongodb+srv://...` |
| `MONGODB_DB_NAME` | Nome do database | `news_system` |
| `NEWSAPI_KEY` | Chave da API do NewsAPI | `abc123def456...` |
| `NEWSAPI_SEARCH_KEYWORDS` | Palavras-chave para buscar notícias (separadas por espaço) | `tecnologia programação javascript` |
| `CRON_SECRET` | Token secreto para autenticar o cron job | Use um UUID ou string aleatória longa |
| `DEFAULT_NEWS_IMAGE` | Imagem padrão quando artigo não tem imagem | `/news-placeholder.jpg` |

### Gerando um CRON_SECRET Seguro

```bash
# Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou use um gerador online: https://www.uuidgenerator.net/
```

---

## Implementação Passo-a-Passo

### Passo 1: Setup do MongoDB

**1.1** Crie o arquivo `lib/mongodb.ts`:

```typescript
import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 10000,
  });

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getNewsCollection() {
  const { db } = await connectToDatabase();
  return db.collection("news_articles");
}
```

**📝 Explicação:**
- **Connection Pooling**: Mantém 2-10 conexões abertas para melhor performance
- **Caching**: Reutiliza conexões entre requisições serverless
- **Timeout**: 10 segundos para seleção de servidor
- **Collection**: `news_articles` é onde todas as notícias são armazenadas

**1.2** Instale as dependências:
```bash
npm install mongodb
```

**1.3** Teste a conexão (crie um arquivo temporário `test-db.js`):
```javascript
const { connectToDatabase } = require('./lib/mongodb.ts');

connectToDatabase()
  .then(() => console.log('✅ Conectado ao MongoDB!'))
  .catch(err => console.error('❌ Erro:', err));
```

```bash
node test-db.js
```

---

### Passo 2: Definição de Tipos

**2.1** Crie o arquivo `lib/types/news.ts`:

```typescript
export type News = {
  slug: string;
  imageSrc: string;
  tag: string;
  date: string;
  title: string;
  bodyText: string;
  cta: string;
  content: string;
  category: string;
  source?: { id: string | null; name: string };
  author?: string | null;
  url: string;
};
```

**📝 Explicação dos Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `slug` | string | Identificador único URL-friendly (ex: `noticia-medicina-2026-01-28`) |
| `imageSrc` | string | URL da imagem do artigo |
| `tag` | string | Categoria visual (ex: "Notícias da indústria") |
| `date` | string | Data formatada em português (ex: "28 de Janeiro, 2026") |
| `title` | string | Título do artigo |
| `bodyText` | string | Resumo/descrição do artigo |
| `cta` | string | Texto do botão de ação (ex: "Saiba mais") |
| `content` | string | Conteúdo completo (truncado pela NewsAPI) |
| `category` | string | Categoria para filtro (ex: "medicina", "tecnologia") |
| `source` | object | Fonte original da notícia (NewsAPI) |
| `author` | string | Autor do artigo |
| `url` | string | Link para artigo original |

---

### Passo 3: Cliente NewsAPI

**3.1** Crie o arquivo `lib/newsapi.ts`:

```typescript
interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export class NewsAPIClient {
  private apiKey: string;
  private baseUrl = "https://newsapi.org/v2";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("NewsAPI key is required");
    }
    this.apiKey = apiKey;
  }

  async searchNews(
    query: string,
    options?: {
      language?: string;
      sortBy?: "relevancy" | "popularity" | "publishedAt";
      pageSize?: number;
      from?: string;
    },
  ): Promise<NewsAPIResponse> {
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      q: query,
      language: options?.language || "pt",
      sortBy: options?.sortBy || "publishedAt",
      pageSize: String(options?.pageSize || 20),
    });

    if (options?.from) {
      params.append("from", options.from);
    }

    const response = await fetch(`${this.baseUrl}/everything?${params}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("NewsAPI rate limit exceeded");
      }
      throw new Error(`NewsAPI error: ${response.statusText}`);
    }

    return response.json();
  }
}

export function createNewsAPIClient() {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    throw new Error("NEWSAPI_KEY environment variable is not set");
  }
  return new NewsAPIClient(apiKey);
}

export type { NewsAPIArticle, NewsAPIResponse };
```

**📝 Explicação:**

- **Endpoint**: `/everything` permite busca completa em todo o banco de notícias
- **Parâmetros Principais**:
  - `q`: Palavras-chave de busca
  - `language`: Idioma dos artigos (pt, en, es, etc.)
  - `sortBy`: Ordenação (publishedAt = mais recentes primeiro)
  - `pageSize`: Máximo de artigos retornados (até 100)
  - `from`: Data mínima para buscar artigos
- **Rate Limiting**: Detecta HTTP 429 e lança erro específico
- **Error Handling**: Captura erros de rede e validação de API key

**3.2** Instale dependências (não há novas dependências necessárias - fetch é nativo)

---

### Passo 4: Utilitários de Transformação

**4.1** Crie o arquivo `utils/slug-generator.ts`:

```typescript
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
```

**📝 Explicação:**
- Converte títulos para formato URL-friendly
- Remove caracteres especiais
- Adiciona sufixo de data para garantir unicidade
- Exemplo: `"Novo Projeto de Lei para Saúde"` → `"novo-projeto-de-lei-para-saude-2026-01-28"`

**4.2** Crie o arquivo `utils/date-formatter.ts`:

```typescript
export function formatDatePortuguese(date: Date): string {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month}, ${year}`;
}
```

**📝 Explicação:**
- Formata datas para o padrão brasileiro
- Exemplo: `new Date('2026-01-28')` → `"28 de Janeiro, 2026"`

**4.3** Crie o arquivo `utils/news-transformer.ts`:

```typescript
import { generateSlug } from "./slug-generator";
import { formatDatePortuguese } from "./date-formatter";
import type { NewsAPIArticle } from "@/lib/newsapi";

interface TransformedNewsArticle {
  slug: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  source: { id: string | null; name: string };
  author: string | null;
  imageSrc: string;
  tag: string;
  date: string;
  bodyText: string;
  cta: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  language: string;
  category: string;
}

export function transformNewsAPIArticle(
  article: NewsAPIArticle,
  defaultImage: string = "/industry-notice.jpg",
  category: string = "medicina",
): TransformedNewsArticle {
  const publishedAt = new Date(article.publishedAt);
  const slug = generateSlug(article.title, publishedAt);

  // Extract clean body text (NewsAPI content is truncated with [+chars])
  const bodyText =
    article.description || article.content || "";

  // Determine tag based on source or keywords
  const tag = determineTag(article.title, article.description);

  return {
    // Original NewsAPI fields
    title: article.title,
    description: article.description || "",
    content: article.content || "",
    url: article.url,
    urlToImage: article.urlToImage || defaultImage,
    publishedAt,
    source: article.source,
    author: article.author,

    // Transformed fields for your app
    slug,
    imageSrc: article.urlToImage || defaultImage,
    tag,
    date: formatDatePortuguese(publishedAt),
    bodyText: bodyText,
    cta: "Saiba mais",

    // Metadata
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    language: "pt",
    category,
  };
}

function determineTag(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("legislação") ||
    text.includes("lei") ||
    text.includes("regulamento")
  ) {
    return "Notícias da indústria";
  }
  if (text.includes("sindicato") || text.includes("união")) {
    return "Notícias da União";
  }
  if (text.includes("trabalhador") || text.includes("direito")) {
    return "Proteção ao Trabalhador";
  }

  return "Notícias da indústria"; // Default
}

export function transformBatchArticles(
  articles: NewsAPIArticle[],
  defaultImage?: string,
  category: string = "medicina",
): TransformedNewsArticle[] {
  return articles.map((article) =>
    transformNewsAPIArticle(article, defaultImage, category),
  );
}

export type { TransformedNewsArticle };
```

**📝 Explicação:**

**Função `determineTag()`:**
- Analisa título e descrição para identificar tema
- Usa matching de palavras-chave (case-insensitive)
- Retorna tag apropriada

**Lógica de Tag Padrão (Customize para seu projeto):**
| Palavras-chave | Tag Atribuída |
|----------------|---------------|
| legislação, lei, regulamento | "Notícias da indústria" |
| sindicato, união | "Notícias da União" |
| trabalhador, direito | "Proteção ao Trabalhador" |
| *padrão* | "Notícias da indústria" |

**4.4** Instale dependências:
```bash
npm install slugify
npm install -D @types/slugify  # se usar TypeScript
```

---

### Passo 5: Rota do Cron Job

**5.1** Crie o arquivo `app/api/cron/fetch-news/route.ts`:

```typescript
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
```

**📝 Explicação:**

**Segurança:**
- Valida header `Authorization: Bearer {CRON_SECRET}`
- Retorna 401 se token não bater

**Lógica de Upsert:**
```typescript
{
  updateOne: {
    filter: { url: article.url },  // Busca por URL única
    update: {
      $set: { ...articleData, updatedAt: new Date() },  // Sempre atualiza
      $setOnInsert: { createdAt: new Date() }  // Só define na inserção
    },
    upsert: true  // Insere se não existir
  }
}
```
- Usa URL como identificador único
- Atualiza artigos existentes (muda apenas `updatedAt`)
- Insere novos artigos (define `createdAt` e `updatedAt`)

**Índices do MongoDB:**
| Índice | Propósito |
|--------|-----------|
| `{ slug: 1 }` | Busca rápida por slug, garante unicidade |
| `{ publishedAt: -1, isActive: 1 }` | Listagem ordenada por data |
| `{ isActive: 1, createdAt: -1 }` | Filtro de artigos ativos |
| `{ category: 1, isActive: 1, publishedAt: -1 }` | Queries filtradas por categoria (composto) |

---

### Passo 6: Configuração do Vercel Cron

**6.1** Crie/edite o arquivo `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-news",
      "schedule": "0 6 * * *"
    }
  ]
}
```

**📝 Explicação do Formato Cron:**

```
┌───────────── minuto (0 - 59)
│ ┌───────────── hora (0 - 23)
│ │ ┌───────────── dia do mês (1 - 31)
│ │ │ ┌───────────── mês (1 - 12)
│ │ │ │ ┌───────────── dia da semana (0 - 6) (Domingo=0)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Exemplos de Schedules:**
| Schedule | Descrição |
|----------|-----------|
| `0 6 * * *` | Todos os dias às 6:00 AM UTC |
| `0 */6 * * *` | A cada 6 horas |
| `0 9,18 * * *` | Às 9:00 e 18:00 UTC |
| `0 8 * * 1` | Toda segunda-feira às 8:00 AM UTC |

**6.2** Teste localmente:

Crie um script de teste `scripts/test-cron.sh`:
```bash
#!/bin/bash
curl -X GET http://localhost:3000/api/cron/fetch-news \
  -H "Authorization: Bearer SEU_CRON_SECRET_AQUI"
```

Execute:
```bash
npm run dev  # Inicie o servidor Next.js
chmod +x scripts/test-cron.sh
./scripts/test-cron.sh
```

**6.3** Configure no Vercel:

1. Deploy seu projeto: `vercel --prod`
2. Acesse o dashboard do Vercel
3. Vá em **Settings** > **Environment Variables**
4. Adicione todas as variáveis do `.env.local`
5. Redeploy: `vercel --prod`
6. Vá em **Deployments** > **Cron Jobs** para ver execuções

---

### Passo 7: API de Recuperação de Dados

**7.1** Crie o arquivo `app/api/news/route.ts`:

```typescript
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
```

**📝 Explicação:**

**Endpoints Disponíveis:**

1. **Listar notícias paginadas:**
```
GET /api/news?limit=10&page=1&category=medicina
```

2. **Buscar notícia específica:**
```
GET /api/news?slug=noticia-exemplo-2026-01-28&category=medicina
```

**Paginação:**
```typescript
const skip = (page - 1) * limit;  // Pula itens de páginas anteriores
```
- Página 1, limit 10: skip = 0 (itens 1-10)
- Página 2, limit 10: skip = 10 (itens 11-20)
- Página 3, limit 10: skip = 20 (itens 21-30)

**Resposta de Listagem:**
```json
{
  "news": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### Passo 8: Componente Frontend

**8.1** Crie o componente `components/sections/latestNews.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { Button } from "../button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import Image from "next/image";
import { Badge } from "../badge";
import type { News } from "@/lib/types/news";
import Link from "next/link";

export const LatestNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news?limit=20&category=medicina");
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNews(data.news || []);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <section id="news" className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <Badge className="mb-2 bg-[#d29531] hover:bg-[#d29531]/90">
              Notícias
            </Badge>
            <h2 className="text-3xl font-bold text-[#2e4b89]">
              Últimas notícias e atualizações
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2e4b89]"></div>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-gray-600">
              Não foi possível carregar as notícias. Tente novamente mais tarde.
            </p>
          </div>
        ) : news.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-600">Nenhuma notícia disponível no momento.</p>
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {news.map((newsItem, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="flex h-full flex-col pt-0">
                    <div className="relative h-52 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={newsItem.imageSrc}
                        alt={newsItem.title}
                        width={500}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-[#2e4b89]">
                          {newsItem.tag}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {newsItem.date}
                        </span>
                      </div>
                      <CardTitle className="text-[#2e4b89]">
                        {newsItem.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-gray-600">
                        {newsItem.bodyText}
                      </p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Link href={`${newsItem.url}`} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="link"
                          className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                        >
                          {newsItem.cta}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center">
              <CarouselPrevious className="static mr-2 translate-y-0" />
              <CarouselNext className="static ml-2 translate-y-0" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
};
```

**📝 Explicação:**

**Padrão de Fetching:**
- Client-side fetching com `useEffect`
- Executa apenas uma vez no mount (array de dependências vazio)
- Três estados: `loading`, `error`, `success`

**Estados Visuais:**
1. **Loading**: Spinner animado
2. **Error**: Mensagem de erro amigável
3. **Empty**: Mensagem quando não há notícias
4. **Success**: Carousel com cards de notícias

**Layout do Card:**
```
┌─────────────────────────┐
│      Imagem (500x300)   │
├─────────────────────────┤
│ Badge     |     Data    │
│ Título                  │
│ Descrição (3 linhas)    │
│                         │
│ [Saiba mais →]          │
└─────────────────────────┘
```

**Responsividade:**
- Mobile: 1 coluna
- Tablet (md): 2 colunas
- Desktop (lg): 3 colunas

**8.2** Instale dependências do carousel (se não tiver):
```bash
npm install embla-carousel-react
```

**8.3** Use o componente em sua página (ex: `app/page.tsx`):
```typescript
import { LatestNews } from "@/components/sections/latestNews";

export default function HomePage() {
  return (
    <main>
      {/* Outros componentes */}
      <LatestNews />
      {/* Outros componentes */}
    </main>
  );
}
```

---

## Guia de Customização

### 5.1 Mudando a Categoria/Tema

**Onde alterar:**

**1. Variável de ambiente** (`.env.local`):
```env
# Antes (medicina)
NEWSAPI_SEARCH_KEYWORDS=medicina farmacêutica saúde

# Depois (tecnologia)
NEWSAPI_SEARCH_KEYWORDS=tecnologia programação javascript react typescript
```

**2. Categoria padrão no transformer** (`utils/news-transformer.ts`):
```typescript
// Linha 30
export function transformNewsAPIArticle(
  article: NewsAPIArticle,
  defaultImage: string = "/industry-notice.jpg",
  category: string = "tecnologia",  // ← Altere aqui
): TransformedNewsArticle {
```

**3. Categoria na API de leitura** (`app/api/news/route.ts`):
```typescript
// Linha 14
const category = searchParams.get("category") || "tecnologia";  // ← Altere aqui
```

**4. Categoria no componente frontend** (`components/sections/latestNews.tsx`):
```typescript
// Linha 26
const response = await fetch("/api/news?limit=20&category=tecnologia");  // ← Altere aqui
```

---

### 5.2 Ajustando Tags e Categorização

**Customize a função `determineTag()` em `utils/news-transformer.ts`:**

**Exemplo para Tecnologia:**
```typescript
function determineTag(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("javascript") ||
    text.includes("typescript") ||
    text.includes("react")
  ) {
    return "JavaScript/TypeScript";
  }
  if (text.includes("python") || text.includes("django")) {
    return "Python";
  }
  if (text.includes("inteligência artificial") || text.includes("machine learning")) {
    return "AI/ML";
  }
  if (text.includes("cloud") || text.includes("aws") || text.includes("azure")) {
    return "Cloud Computing";
  }

  return "Desenvolvimento"; // Default
}
```

**Exemplo para Esportes:**
```typescript
function determineTag(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("futebol") || text.includes("copa")) {
    return "Futebol";
  }
  if (text.includes("basquete") || text.includes("nba")) {
    return "Basquete";
  }
  if (text.includes("vôlei") || text.includes("voleibol")) {
    return "Vôlei";
  }
  if (text.includes("olimpíadas") || text.includes("olímpico")) {
    return "Olimpíadas";
  }

  return "Esportes Gerais"; // Default
}
```

**Usando Regex para Matching Avançado:**
```typescript
function determineTag(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  // Match múltiplas variações
  if (/\b(js|javascript|ecmascript)\b/.test(text)) {
    return "JavaScript";
  }

  // Match com acentuação
  if (/intelig[eê]ncia artificial|ia|ai|machine learning|ml/i.test(text)) {
    return "Inteligência Artificial";
  }

  return "Tecnologia";
}
```

---

### 5.3 Personalizando Transformação de Dados

**Adicionando Campos Customizados:**

```typescript
// Em utils/news-transformer.ts
interface TransformedNewsArticle {
  // Campos existentes...
  slug: string;
  title: string;
  // ...

  // NOVOS CAMPOS CUSTOMIZADOS
  readingTime: number;      // Tempo estimado de leitura em minutos
  sentiment: "positive" | "negative" | "neutral";  // Análise de sentimento
  keywords: string[];       // Palavras-chave extraídas
  priority: "high" | "medium" | "low";  // Prioridade
}

export function transformNewsAPIArticle(
  article: NewsAPIArticle,
  defaultImage: string = "/industry-notice.jpg",
  category: string = "medicina",
): TransformedNewsArticle {
  const publishedAt = new Date(article.publishedAt);
  const slug = generateSlug(article.title, publishedAt);
  const bodyText = article.description || article.content || "";
  const tag = determineTag(article.title, article.description);

  // NOVOS: Calcular campos customizados
  const readingTime = calculateReadingTime(article.content);
  const sentiment = analyzeSentiment(article.title, article.description);
  const keywords = extractKeywords(article.title, article.description);
  const priority = determinePriority(article.source, publishedAt);

  return {
    // Campos existentes...
    title: article.title,
    slug,
    // ...

    // Novos campos
    readingTime,
    sentiment,
    keywords,
    priority,
  };
}

// Funções auxiliares
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function analyzeSentiment(title: string, description: string): "positive" | "negative" | "neutral" {
  const text = `${title} ${description}`.toLowerCase();
  const positiveWords = ["sucesso", "vitória", "crescimento", "aumento"];
  const negativeWords = ["crise", "queda", "redução", "problema"];

  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

function extractKeywords(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const stopWords = ["de", "da", "do", "o", "a", "e", "para", "com"];

  return text
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5);  // Top 5 keywords
}

function determinePriority(source: { name: string }, publishedAt: Date): "high" | "medium" | "low" {
  const trustedSources = ["Reuters", "BBC", "CNN"];
  const isRecent = Date.now() - publishedAt.getTime() < 24 * 60 * 60 * 1000; // < 24h

  if (trustedSources.includes(source.name) && isRecent) return "high";
  if (isRecent) return "medium";
  return "low";
}
```

**Modificando Formatação de Datas (Outros Idiomas):**

```typescript
// utils/date-formatter.ts - Versão Espanhol
export function formatDateSpanish(date: Date): string {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month}, ${year}`;
}

// utils/date-formatter.ts - Versão Inglês
export function formatDateEnglish(date: Date): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}
```

---

### 5.4 Múltiplas Categorias no Mesmo Banco

**Estratégia de Naming:**

```
categoria: "medicina"
categoria: "tecnologia"
categoria: "esportes"
categoria: "politica"
```

**Estrutura Recomendada:**

```typescript
// Arquivo de configuração: config/categories.ts
export const CATEGORIES = {
  MEDICINE: "medicina",
  TECHNOLOGY: "tecnologia",
  SPORTS: "esportes",
  POLITICS: "politica",
} as const;

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];
```

**Cron Job para Múltiplas Categorias:**

Opção 1: Um cron job para cada categoria (`vercel.json`):
```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-news?category=medicina",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/fetch-news?category=tecnologia",
      "schedule": "0 7 * * *"
    },
    {
      "path": "/api/cron/fetch-news?category=esportes",
      "schedule": "0 8 * * *"
    }
  ]
}
```

Opção 2: Modificar a rota do cron para buscar múltiplas categorias (`app/api/cron/fetch-news/route.ts`):
```typescript
export async function GET(request: NextRequest) {
  // ... autenticação ...

  const categories = [
    { name: "medicina", keywords: "medicina farmacêutica saúde" },
    { name: "tecnologia", keywords: "tecnologia programação javascript" },
    { name: "esportes", keywords: "futebol basquete esportes" },
  ];

  const results = [];

  for (const cat of categories) {
    const response = await newsClient.searchNews(cat.keywords, {
      language: "pt",
      sortBy: "publishedAt",
      pageSize: 20,
      from: sevenDaysAgo,
    });

    const transformedArticles = transformBatchArticles(
      response.articles,
      defaultImage,
      cat.name,  // ← Define categoria aqui
    );

    // Store in MongoDB
    const bulkOps = transformedArticles.map((article) => {
      const { createdAt, updatedAt, ...articleData } = article;
      return {
        updateOne: {
          filter: { url: article.url, category: cat.name },  // ← Filter por categoria
          update: {
            $set: { ...articleData, updatedAt: new Date() },
            $setOnInsert: { createdAt: new Date() },
          },
          upsert: true,
        },
      };
    });

    const result = await collection.bulkWrite(bulkOps);
    results.push({ category: cat.name, inserted: result.upsertedCount });
  }

  return NextResponse.json({ success: true, results });
}
```

**API de Leitura com Seletor de Categoria:**

```typescript
// app/api/news/route.ts - já suporta filtro por categoria
// Uso:
// GET /api/news?category=medicina
// GET /api/news?category=tecnologia
// GET /api/news?category=esportes
```

**Componente com Seletor de Categoria:**

```typescript
"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import type { News } from "@/lib/types/news";

export const LatestNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [category, setCategory] = useState("medicina");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const response = await fetch(`/api/news?limit=20&category=${category}`);
        const data = await response.json();
        setNews(data.news || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [category]);  // ← Re-fetch quando categoria mudar

  return (
    <section id="news" className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Últimas Notícias</h2>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medicina">Medicina</SelectItem>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
              <SelectItem value="esportes">Esportes</SelectItem>
              <SelectItem value="politica">Política</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Renderização de notícias */}
      </div>
    </section>
  );
};
```

---

## Referência Rápida

### 5.1 Checklist de Implementação

```
✅ Configuração do Ambiente
  ☐ .env.local criado com todas as variáveis
  ☐ CRON_SECRET gerado (aleatório e seguro)
  ☐ MongoDB connection string testada
  ☐ NewsAPI key validada

✅ Implementação Backend
  ☐ lib/mongodb.ts implementado
  ☐ lib/types/news.ts criado
  ☐ lib/newsapi.ts implementado
  ☐ utils/slug-generator.ts criado
  ☐ utils/date-formatter.ts criado
  ☐ utils/news-transformer.ts implementado
  ☐ app/api/cron/fetch-news/route.ts criado
  ☐ app/api/news/route.ts criado
  ☐ vercel.json configurado

✅ Customização
  ☐ NEWSAPI_SEARCH_KEYWORDS ajustado para seu tema
  ☐ Função determineTag() customizada
  ☐ Categoria padrão alterada em todos os arquivos
  ☐ Tags e labels traduzidas (se necessário)

✅ Frontend
  ☐ components/sections/latestNews.tsx implementado
  ☐ Componente importado na página principal
  ☐ Estilos customizados aplicados
  ☐ Imagem padrão adicionada em /public
```

---

### 5.2 Estrutura de Arquivos

```
seu-projeto/
├── app/
│   ├── api/
│   │   ├── cron/
│   │   │   └── fetch-news/
│   │   │       └── route.ts         # Cron job principal
│   │   └── news/
│   │       └── route.ts             # API de leitura de notícias
│   ├── layout.tsx
│   └── page.tsx                     # Página principal
│
├── components/
│   └── sections/
│       └── latestNews.tsx           # Componente de notícias
│
├── lib/
│   ├── mongodb.ts                   # Conexão MongoDB
│   ├── newsapi.ts                   # Cliente NewsAPI
│   └── types/
│       └── news.ts                  # Definições de tipos
│
├── utils/
│   ├── slug-generator.ts            # Geração de slugs
│   ├── date-formatter.ts            # Formatação de datas
│   └── news-transformer.ts          # Transformação de dados
│
├── public/
│   └── industry-notice.jpg          # Imagem padrão
│
├── .env.local                       # Variáveis de ambiente (não commitar)
├── .gitignore
├── next.config.ts
├── package.json
├── vercel.json                      # Configuração do cron
└── tsconfig.json
```

---

### 5.3 Comandos Úteis

**Desenvolvimento:**
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Testar cron job localmente
curl -X GET http://localhost:3000/api/cron/fetch-news \
  -H "Authorization: Bearer ${CRON_SECRET}"

# Testar API de notícias
curl http://localhost:3000/api/news?limit=5&category=medicina
```

**Deploy:**
```bash
# Deploy para produção
vercel --prod

# Ver logs em tempo real
vercel logs --follow

# Ver variáveis de ambiente
vercel env ls
```

**MongoDB:**
```bash
# Conectar via CLI
mongosh "mongodb+srv://cluster.mongodb.net/news_system" --username seu_usuario

# Contar documentos
db.news_articles.countDocuments({ category: "medicina" })

# Ver últimas notícias
db.news_articles.find({ category: "medicina" }).sort({ publishedAt: -1 }).limit(5).pretty()

# Deletar notícias antigas (>30 dias)
db.news_articles.deleteMany({
  publishedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
})
```

**Git:**
```bash
# Adicionar todos arquivos
git add .

# Commit
git commit -m "feat: implement news system"

# Push e deploy automático (se conectado ao Vercel)
git push origin main
```

---

## Conclusão

Você agora tem um sistema completo de notícias automatizado! Este guia cobriu:

✅ Implementação passo-a-passo de todos os componentes
✅ Customização para diferentes categorias e temas
✅ Estratégias para múltiplos projetos no mesmo banco

**Recursos Adicionais:**

- [Documentação NewsAPI](https://newsapi.org/docs)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Criado com ❤️ para facilitar a replicação de sistemas de notícias automatizados.**

*Última atualização: Janeiro 2026*
