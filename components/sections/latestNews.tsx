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
