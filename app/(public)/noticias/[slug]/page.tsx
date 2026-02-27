import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsDetail } from '@/components/sections/news-detail';
import { getNewsArticleBySlug } from '@/lib/news-queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Notícia não encontrada | SINDIPROSAN-ABC',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sindiprosan.com.br';

  return {
    title: `${article.title} | SINDIPROSAN-ABC`,
    description: article.bodyText,
    openGraph: {
      title: article.title,
      description: article.bodyText,
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
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.bodyText,
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
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <NewsDetail news={article} />
    </div>
  );
}
