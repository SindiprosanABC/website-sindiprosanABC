import type { SerpApiJobsResponse } from "./types/jobs";

interface SerpApiJobsParams {
  query: string;
  location?: string;
  start?: number; // Paginação
  num?: number; // Número de resultados (padrão: 10)
}

export class SerpApiClient {
  private apiKey: string;
  private baseUrl = "https://serpapi.com/search";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("SerpApi key is required");
    }
    this.apiKey = apiKey;
  }

  async searchJobs(
    query: string,
    options?: {
      location?: string;
      num?: number;
      start?: number;
    },
  ): Promise<SerpApiJobsResponse> {
    const params = new URLSearchParams({
      engine: "google_jobs",
      api_key: this.apiKey,
      q: query,
      hl: "pt-br",
      gl: "br",
    });

    if (options?.location) {
      params.append("location", options.location);
    }
    if (options?.num) {
      params.append("num", String(options.num));
    }
    if (options?.start) {
      params.append("start", String(options.start));
    }

    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("SerpApi rate limit exceeded");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `SerpApi error: ${response.statusText} - ${JSON.stringify(errorData)}`,
      );
    }

    return response.json();
  }
}

export function createSerpApiClient() {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    throw new Error("SERPAPI_KEY environment variable is not set");
  }
  return new SerpApiClient(apiKey);
}

export type { SerpApiJobsParams };
