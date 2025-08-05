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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Separator } from "@/components/ui/separator";
import { latestNews, type News } from "@/lib/news-data";

interface NewsDetailProps {
  news: News;
}

export function NewsDetail({ news }: NewsDetailProps) {
  // Get related news (excluding current news)
  const relatedNews = latestNews
    .filter((item) => item.slug !== news.slug)
    .slice(0, 4);

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
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent p-0"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent p-0"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent p-0"
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

              {/* Extended content based on news type */}
              {news.tag === "Notícias da indústria" && (
                <>
                  <h2 className="mt-8 mb-4 text-2xl font-bold text-[#2e4b89]">
                    Impacto na Indústria
                  </h2>
                  <p className="mb-6 leading-relaxed text-gray-700">
                    Esta mudança representa um marco significativo para o setor
                    farmacêutico. Os representantes de vendas precisarão se
                    adaptar às novas regulamentações, que visam aumentar a
                    transparência e melhorar a qualidade dos serviços prestados
                    aos profissionais de saúde.
                  </p>
                  <p className="mb-6 leading-relaxed text-gray-700">
                    Nossa união está trabalhando ativamente para fornecer
                    orientação e recursos para ajudar nossos membros a navegar
                    por essas mudanças com sucesso. Oferecemos treinamentos
                    especializados e materiais informativos para garantir
                    conformidade total.
                  </p>
                </>
              )}

              {news.tag === "Proteção ao Trabalhador" && (
                <>
                  <h2 className="mt-8 mb-4 text-2xl font-bold text-[#2e4b89]">
                    O que diz a legislação e por que isso é importante
                  </h2>
                  <p className="mb-6 leading-relaxed text-gray-700">
                    A estabilidade está prevista no artigo 118 da Lei 8.213/91 e
                    agora pode ser aplicada mesmo nos seguintes casos: sem
                    afastamento formal por mais de 15 dias e sem concessão de
                    auxílio-doença acidentário (B91)
                  </p>
                  <p className="mb-6 leading-relaxed text-gray-700">
                    O elemento central passa a ser a comprovação do nexo causal
                    ou concausal, ou seja, a ligação entre o problema de saúde e
                    o trabalho executado. Isso vale tanto para doenças
                    ocupacionais quanto para acidentes relacionados ao exercício
                    da função.
                  </p>
                </>
              )}

              {news.tag === "notícias da União" && (
                <>
                  <h2 className="mt-8 mb-4 text-2xl font-bold text-[#2e4b89]">
                    Programação do Evento
                  </h2>
                  <p className="mb-6 leading-relaxed text-gray-700">
                    A conferência anual será realizada nos dias 15-17 de
                    setembro, reunindo profissionais de todo o país. O evento
                    contará com palestras magistrais, workshops práticos e
                    sessões de networking.
                  </p>
                  <ul className="mb-6 list-disc pl-6 text-gray-700">
                    <li>Palestras com especialistas renomados</li>
                    <li>Workshops sobre novas técnicas de vendas</li>
                    <li>Sessões de networking</li>
                    <li>Apresentação de novos produtos</li>
                  </ul>
                </>
              )}

              {news.tag === "Membro Spotlight" && (
                <>
                  <h2 className="mt-8 mb-4 text-2xl font-bold text-[#2e4b89]">
                    Estratégias de Sucesso
                  </h2>
                  <p className="mb-6 leading-relaxed text-gray-700">
                    Jane Smith utilizou uma combinação de técnicas tradicionais
                    e ferramentas digitais para alcançar resultados
                    excepcionais. Sua abordagem focada no relacionamento com
                    clientes e uso estratégico de dados resultou em um
                    crescimento de 150% nas vendas.
                  </p>
                  <blockquote className="mb-6 border-l-4 border-[#d29531] pl-6 text-gray-600 italic">
                    O segredo está em entender as necessidades específicas de
                    cada cliente e oferecer soluções personalizadas. A união me
                    forneceu as ferramentas necessárias para isso.
                  </blockquote>
                </>
              )}

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
            <section>
              <h2 className="mb-6 text-2xl font-bold text-[#2e4b89]">
                Notícias Relacionadas
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedNews.map((relatedItem) => (
                  <Card
                    key={relatedItem.slug}
                    className="pt-0 pb-6 transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={relatedItem.imageSrc || "/placeholder.svg"}
                        alt={relatedItem.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="mb-2 flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-xs text-[#2e4b89]"
                        >
                          {relatedItem.tag}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {relatedItem.date}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2 text-lg text-[#2e4b89]">
                        {relatedItem.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {relatedItem.bodyText}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/news/${relatedItem.slug}`}>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-[#d29531] hover:text-[#d29531]/80"
                        >
                          Ler mais
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
