// Interface para resposta da SerpApi (Google Jobs)
export interface SerpApiJobResult {
  title: string;
  company_name: string;
  location: string;
  via: string; // e.g., "via LinkedIn"
  description: string;
  thumbnail?: string;
  extensions?: string[]; // ["30 days ago", "Full-time", "$50K - $80K"]
  detected_extensions?: {
    posted_at?: string;
    schedule_type?: string;
    work_from_home?: boolean;
    salary?: string;
  };
  job_highlights?: Array<{
    title: string;
    items: string[];
  }>;
  apply_options?: Array<{
    title: string;
    link: string;
  }>;
  job_id?: string; // Opcional - alguns resultados podem não ter
  share_link?: string;
}

export interface SerpApiJobsResponse {
  search_metadata: {
    id: string;
    status: string;
    created_at: string;
  };
  jobs_results: SerpApiJobResult[];
  serpapi_pagination?: {
    next_page_token?: string;
  };
}

// Interface para formato interno (MongoDB)
export interface Job {
  slug: string;
  jobId: string; // SerpApi job_id original
  title: string;
  companyName: string;
  location: string;
  description: string;
  thumbnail?: string;
  via: string;
  applyLink: string; // Link principal para aplicar
  salary?: string;
  schedule?: string; // Full-time, Part-time, etc
  postedAt?: string;
  postedDate: string; // Formatado em português
  extensions: string[]; // Tags visuais
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: string; // "medicina" por padrão
}
