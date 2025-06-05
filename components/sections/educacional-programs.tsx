import { Calendar } from "lucide-react";
import { Badge } from "../badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { Button } from "../button";

export const EducationalPrograms = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <Badge className="mb-2 bg-[#d29531] hover:bg-[#d29531]/90">
            Melhore suas skills
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-[#2e4b89]">
            Programas Educacionais
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Mantenha-se à frente em sua carreira com nossos programas de
            treinamento especializados, projetados para profissionais como você.
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Programas futuros</TabsTrigger>
            <TabsTrigger value="popular">Cursos Populares</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <Badge className="mb-2 w-fit bg-[#2e4b89] hover:bg-[#2e4b89]/90">
                    A definir
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    Inteligência Artificial para Propagandistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Aprenda como melhor seu desempenho utilizando IA Generativa
                  </p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Presencial - 1 dia de evento</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#d29531] hover:bg-[#d29531]/90">
                    Em breve
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Badge className="mb-2 w-fit bg-[#2e4b89] hover:bg-[#2e4b89]/90">
                    A definir
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    Neurociência para Negócios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Aprenda como utilizer neurociencia para ter foco em
                    Persuasão e Tomada de Decisão
                  </p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Presencial - 1 dia de Evento</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#d29531] hover:bg-[#d29531]/90">
                    Em breve
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Badge className="mb-2 w-fit bg-[#2e4b89] hover:bg-[#2e4b89]/90">
                    A definir
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    LinkedIn para Propagandistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Aprenda como deixar seu LinkedIn impecável e criar conteúdos
                    relevantes na rede social
                  </p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Presencial - 1 dia de evento</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#d29531] hover:bg-[#d29531]/90">
                    Em breve
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <Badge className="mb-2 w-fit bg-[#2e4b89] hover:bg-[#2e4b89]/90">
                    Sob demanda
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    Comunicação efetiva com colaboradores da saúde
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Desenvolva estratégias para construir importantes
                    relacionamentos com Médicos e colaboradores da saúde
                  </p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>No seu ritmo | 10 Horas</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#d29531] hover:bg-[#d29531]/90">
                    Em breve
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Badge className="mb-2 w-fit bg-[#2e4b89] hover:bg-[#2e4b89]/90">
                    Sob demanda
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    Entendendo dados clínicos para profissionais de vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Aprenda a interpretar e comunicar efetivamente dados de
                    ensaios clínicos aos profissionais de saúde
                  </p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>No seu ritmo | 8 Horas</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#d29531] hover:bg-[#d29531]/90">
                    Em breve
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Badge className="mb-2 w-fit bg-[#2e4b89] hover:bg-[#2e4b89]/90">
                    Sob demanda
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    Habilidades de negociação para vendas farmacêuticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Domine a arte da negociação para garantir melhores contratos
                    e negócios na indústria farmacêutica.
                  </p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>No seu ritmo | 6 Horas</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#d29531] hover:bg-[#d29531]/90">
                    Em breve
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
