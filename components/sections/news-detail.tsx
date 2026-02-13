'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/card";
import type { News } from "@/lib/types/news";

export function NewsDetail({ news }: { news: News }) {
  const [relatedNews, setRelatedNews] = useState<News[]>([]);

  useEffect(() => {
    async function fetchRelatedNews() {
      try {
        const response = await fetch(`/api/news?limit=3&category=${news.category || 'medicina'}`);
        if (!response.ok) throw new Error("Failed to fetch related news");
        const data = await response.json();
        // Filter out current article and get only 3 related
        const filtered = (data.news || []).filter((item: News) => item.slug !== news.slug).slice(0, 3);
        setRelatedNews(filtered);
      } catch (err) {
        console.error("Error fetching related news:", err);
      }
    }
    fetchRelatedNews();
  }, [news.slug, news.category]);

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'native') => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = news.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: title,
            url: url,
          }).catch((err) => console.log('Error sharing:', err));
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(url);
          alert('Link copiado para a área de transferência!');
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/#news"
            className="inline-flex items-center text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para notícias
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Article Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-4">
              <Badge
                variant="outline"
                className="border-[#2e4b89] text-[#2e4b89]"
              >
                {news.tag}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-1 h-4 w-4" />
                {news.date}
              </div>
            </div>

            <h1 className="mb-6 text-4xl leading-tight font-bold text-[#2e4b89]">
              {news.title}
            </h1>

            {/* Share buttons */}
            <div className="mb-8 flex items-center gap-2">
              <span className="mr-2 text-sm text-gray-600">Compartilhar:</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent p-0"
                onClick={() => handleShare('facebook')}
                title="Compartilhar no Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent p-0"
                onClick={() => handleShare('twitter')}
                title="Compartilhar no Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent p-0"
                onClick={() => handleShare('linkedin')}
                title="Compartilhar no LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent p-0"
                onClick={() => handleShare('native')}
                title="Compartilhar"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={news.imageSrc || "/placeholder.svg"}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="mb-12 rounded-lg bg-white p-8">
            <div className="prose prose-lg max-w-none">
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {news.bodyText}
              </p>
                  <h2 className="mt-8 mb-4 text-2xl font-bold text-[#2e4b89]">
                    {news.title}
                  </h2>
                  <p className="mb-6 leading-relaxed text-gray-700">
                    {news.bodyText}
                  </p>
                  <p className="mb-6 leading-relaxed text-gray-700">
                    {/* content vem com html no meio */}
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                  </p>

              <Separator className="my-8" />

              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-[#2e4b89]">
                  Como o SINDIPROSAN-ABC apoia os profissionais
                </h3>
                <p className="text-sm text-gray-600">
                  O SINDIPROSAN-ABC atua diretamente na defesa dos profissionais
                  da propaganda farmacêutica, nós oferecemos ações de
                  conscientização sobre direitos trabalhistas, atendimento
                  especializado - presencial ou via WhatsApp, apoio jurídico em
                  casos de doença ocupacional ou acidente de trabalho...
                </p>
              </div>
            </div>
          </div>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-[#2e4b89]">
                Notícias Relacionadas
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedNews.map((newsItem, index) => (
                  <Card key={index} className="flex h-full flex-col">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={newsItem.imageSrc}
                        alt={newsItem.title}
                        fill
                        className="object-cover"
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
                      <CardTitle className="text-[#2e4b89] line-clamp-2">
                        {newsItem.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-gray-600">
                        {newsItem.bodyText}
                      </p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Link href={`/noticias/${newsItem.slug}`}>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                        >
                          Saiba mais
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}