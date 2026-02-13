import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsDetail } from '@/components/sections/news-detail';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getNewsArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/news?slug=${slug}`, {
      cache: 'no-store',
    });
    console.log('[NewsDetail Page] API response status:', response.status, 'for slug:', slug);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.news;
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  if (!article) {
    return {
      title: 'Notícia não encontrada | SINDIPROSAN-ABC',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    title: `${article.title} | SINDIPROSAN-ABC`,
    description: article.bodyText || article.description,
    openGraph: {
      title: article.title,
      description: article.bodyText || article.description,
      images: [
        {
          url: article.imageSrc.startsWith('http')
            ? article.imageSrc
            : `${baseUrl}${article.imageSrc}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.bodyText || article.description,
      images: [
        article.imageSrc.startsWith('http')
          ? article.imageSrc
          : `${baseUrl}${article.imageSrc}`,
      ],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  console.log('[NewsDetail Page] Fetched article:', article ? article.title : 'null');

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <NewsDetail news={article} />
    </div>
  );
}
