import { notFound } from "next/navigation";
import { latestNews } from "@/lib/news-data";
import { NewsDetail } from "@/components/sections/news-detail";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { slug } = await params;

  const news = latestNews.find((item) => item.slug === slug);

  if (!news) {
    notFound();
  }

  return <NewsDetail news={news} />;
}

export async function generateStaticParams() {
  return latestNews.map((news) => ({
    slug: news.slug,
  }));
}

export async function generateMetadata({ params }: NewsPageProps) {
  const { slug } = await params;
  const news = latestNews.find((item) => item.slug === slug);

  if (!news) {
    return {
      title: "News Not Found",
    };
  }

  return {
    title: news.title,
    description: news.bodyText,
  };
}
