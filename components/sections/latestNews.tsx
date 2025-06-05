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
          {/* <Button
            variant="link"
            className="flex h-auto items-center gap-1 p-0 text-[#2e4b89] hover:text-[#d29531]"
          >
            View All News <ArrowRight className="h-4 w-4" />
          </Button> */}
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card className="pt-0">
                <div className="relative h-52 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/industry-notice.jpg"
                    alt="Industry conference"
                    width={500}
                    height={300}
                    className="h-full w-full"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-[#2e4b89]">
                      Notícias da indústria
                    </Badge>
                    <span className="text-sm text-gray-500">
                      15 de Maio, 2025
                    </span>
                  </div>
                  <CardTitle className="text-[#2e4b89]">
                    Nova legislação afeta representantes de vendas farmacêuticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">
                    Mudanças legislativas recentes afetarão como os
                    representantes de vendas farmacêuticas interagem com os
                    prestadores de serviços de saúde. Nosso motivo é trabalhar
                    duro para que essas mudanças acontecam
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                  >
                    Saiba mais
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card className="pt-0">
                <div className="relative h-52 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/union-meeting.jpg"
                    alt="Union meeting"
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-[#2e4b89]">
                      notícias da União
                    </Badge>
                    <span className="text-sm text-gray-500">
                      10 de Maio, 2025
                    </span>
                  </div>
                  <CardTitle className="text-[#2e4b89]">
                    Conferência Anual da União agendada para setembro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">
                    Marque seus calendários para nossa conferência anual,
                    apresentando palestrantes, oficinas e oportunidades de
                    networking para todos os membros.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                  >
                    Saiba mais
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card className="pt-0">
                <div className="relative h-52 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/member-sale.jpg"
                    alt="Healthcare professionals"
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-[#2e4b89]">
                      Membro Spotlight
                    </Badge>
                    <span className="text-sm text-gray-500">
                      % de Maio, 2025
                    </span>
                  </div>
                  <CardTitle className="text-[#2e4b89]">
                    História de sucesso de um membro - quebrando recorde de
                    vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">
                    Leia sobre como Jane Smith, membro da União, utilizou nosso
                    Recursos para alcançar números de vendas recorde em ela
                    território.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                  >
                    Saiba mais
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card className="pt-0">
                <div className="relative h-52 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src="/marketing-digital.jpg"
                    alt="Digital marketing"
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-[#2e4b89]">
                      Notícias da indústria
                    </Badge>
                    <span className="text-sm text-gray-500">
                      1 de Maio, 2025
                    </span>
                  </div>
                  <CardTitle className="text-[#2e4b89]">
                    Transformção digital em vendas farmacêuticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">
                    Explore como ferramentas digitais podem mudar o mercado de
                    vendas farmacêuticas e como podemos nos adaptar
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                  >
                    Saiba mais
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
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
