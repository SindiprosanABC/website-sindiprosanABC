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
import { latestNews } from "@/lib/news-data";
import Link from "next/link";

export const LatestNews = () => {
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

        <Carousel className="w-full">
          <CarouselContent>
            {latestNews.map((news, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="pt-0">
                  <div className="relative h-52 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={news.imageSrc}
                      alt={news.title}
                      width={500}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline" className="text-[#2e4b89]">
                        {news.tag}
                      </Badge>
                      <span className="text-sm text-gray-500">{news.date}</span>
                    </div>
                    <CardTitle className="text-[#2e4b89]">
                      {news.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-gray-600">
                      {news.bodyText}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/news/${news.slug}`}>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                      >
                        {news.cta}
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
      </div>
    </section>
  );
};
