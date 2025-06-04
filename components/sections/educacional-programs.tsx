import { Calendar } from "lucide-react";
import { Badge } from "../badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { Button } from "../button";

export const EducationalPrograms = () => {
  return (
    <section className="bg-gray-50 py-16">
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
            <TabsTrigger value="upcoming">Upcoming Programs</TabsTrigger>
            <TabsTrigger value="popular">Popular Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <Badge className="mb-2 w-fit bg-[#2e4b89] hover:bg-[#2e4b89]/90">
                    June 15, 2025
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    Inteligência Artificial para Propagandistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Inteligência Artificial para Propagandistas
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
                    Neurociência para Negócios
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
                    On-Demand
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    Effective Communication with Healthcare Providers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Develop strategies for building strong relationships with
                    doctors and healthcare facilities.
                  </p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Self-Paced | 10 Hours</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#d29531] hover:bg-[#d29531]/90">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Badge className="mb-2 w-fit bg-[#2e4b89] hover:bg-[#2e4b89]/90">
                    On-Demand
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    Understanding Clinical Data for Sales Professionals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Learn how to interpret and effectively communicate clinical
                    trial data to healthcare providers.
                  </p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Self-Paced | 8 Hours</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#d29531] hover:bg-[#d29531]/90">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Badge className="mb-2 w-fit bg-[#2e4b89] hover:bg-[#2e4b89]/90">
                    On-Demand
                  </Badge>
                  <CardTitle className="text-[#2e4b89]">
                    Negotiation Skills for Pharmaceutical Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Master the art of negotiation to secure better contracts and
                    deals in the pharmaceutical industry.
                  </p>
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Self-Paced | 6 Hours</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#d29531] hover:bg-[#d29531]/90">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            className="border-[#2e4b89] text-[#2e4b89] hover:bg-[#2e4b89] hover:text-white"
          >
            View All Programs
          </Button>
        </div>
      </div>
    </section>
  );
};
