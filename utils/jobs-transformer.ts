import { generateSlug } from "./slug-generator";
import type { SerpApiJobResult } from "@/lib/types/jobs";

interface TransformedJob {
  slug: string;
  jobId: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  thumbnail?: string;
  via: string;
  applyLink: string;
  salary?: string;
  schedule?: string;
  postedAt?: string;
  postedDate: string;
  extensions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: string;
}

export function transformSerpApiJob(
  job: SerpApiJobResult,
  category: string = "medicina",
): TransformedJob {
  // Gerar ID único e seguro (fallback se job_id não existir)
  const jobId =
    job.job_id ||
    `fallback-${Buffer.from(job.title + job.company_name)
      .toString("base64")
      .substring(0, 16)}`;

  // Gerar slug único baseado em empresa + título + jobId
  const slugBase = `${job.company_name}-${job.title}`;
  const slug = `${generateSlug(slugBase)}-${jobId.substring(0, 8)}`;

  // Extrair data de publicação
  const postedAt = job.detected_extensions?.posted_at || "";
  const postedDate = formatPostedDate(postedAt);

  // Extrair link de aplicação
  const applyLink = job.apply_options?.[0]?.link || job.share_link || "#";

  // Extrair salário
  const salary =
    job.detected_extensions?.salary || extractSalaryFromExtensions(job.extensions);

  // Extrair tipo de horário
  const schedule =
    job.detected_extensions?.schedule_type ||
    extractScheduleFromExtensions(job.extensions);

  return {
    slug,
    jobId,
    title: job.title,
    companyName: job.company_name,
    location: job.location,
    description: job.description,
    thumbnail: job.thumbnail || "",
    via: job.via,
    applyLink,
    salary,
    schedule,
    postedAt,
    postedDate,
    extensions: job.extensions || [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category,
  };
}

function formatPostedDate(postedAt: string): string {
  if (!postedAt) return "Data não especificada";

  // Parse comum: "30 days ago", "1 week ago", "today"
  if (
    postedAt.toLowerCase().includes("today") ||
    postedAt.toLowerCase().includes("hoje")
  ) {
    return "Hoje";
  }
  if (
    postedAt.toLowerCase().includes("yesterday") ||
    postedAt.toLowerCase().includes("ontem")
  ) {
    return "Ontem";
  }

  // Tentar converter para português
  const daysMatch = postedAt.match(/(\d+)\s+days?/i);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    return `Há ${days} ${days === 1 ? "dia" : "dias"}`;
  }

  const weeksMatch = postedAt.match(/(\d+)\s+weeks?/i);
  if (weeksMatch) {
    const weeks = parseInt(weeksMatch[1]);
    return `Há ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  }

  return postedAt; // Fallback
}

function extractSalaryFromExtensions(extensions?: string[]): string | undefined {
  if (!extensions) return undefined;

  // Procurar por padrões de salário
  for (const ext of extensions) {
    if (ext.match(/\$|R\$|USD|BRL|salary/i)) {
      return ext;
    }
  }
  return undefined;
}

function extractScheduleFromExtensions(
  extensions?: string[],
): string | undefined {
  if (!extensions) return undefined;

  const scheduleKeywords = [
    "full-time",
    "part-time",
    "contract",
    "tempo integral",
    "meio período",
  ];
  for (const ext of extensions) {
    if (
      scheduleKeywords.some((keyword) => ext.toLowerCase().includes(keyword))
    ) {
      return ext;
    }
  }
  return undefined;
}

export function transformBatchJobs(
  jobs: SerpApiJobResult[],
  category: string = "medicina",
): TransformedJob[] {
  return jobs.map((job) => transformSerpApiJob(job, category));
}

export type { TransformedJob };
