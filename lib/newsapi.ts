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
