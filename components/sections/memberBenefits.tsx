import { BookOpen, ChevronRight, FileText, Heart } from "lucide-react";
import { Badge } from "../badge";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Button } from "../button";
import Link from "next/link";

export const MemberBenefits = () => {
  return (
    <section id="benefits" className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <Badge className="mb-2 bg-[#d29531] hover:bg-[#d29531]/90">
            Por que se juntar a nós ?
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-[#2e4b89]">
            Benefício dos associados
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            O SINDIPROSAN-ABC está a sua disposição para auxiliar em todos os
            momentos de sua carreira
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2e4b89]/10">
                <FileText className="h-6 w-6 text-[#2e4b89]" />
              </div>
              <CardTitle className="text-[#2e4b89]">
                Proteção Legal e Suporte Profissional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Revisão de contratos e assistência em negociações</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Resolução de disputas no ambiente de trabalho</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>
                    Consultoria jurídica para questões relacionadas ao trabalho
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Homologações</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Salas de reunião para locação</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2e4b89]/10">
                <Heart className="h-6 w-6 text-[#2e4b89]" />
              </div>
              <CardTitle className="text-[#2e4b89]">
                Saúde e Bem-estar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Tratamento odontológico com descontos especiais</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Atendimento psicológico</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Tratamento médico com descontos especiais</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Clube de campo / colônia de férias</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Convênios com outros sindicatos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2e4b89]/10">
                <BookOpen className="h-6 w-6 text-[#2e4b89]" />
              </div>
              <CardTitle className="text-[#2e4b89]">
                Educação e Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Programas educacionais</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Workshops e seminários específicos</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Descontos em universidades, pós-graduação e MBA</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#d29531]" />
                  <span>Recursos para desenvolvimento profissional</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Link href="https://wa.me/551338777780?text=Ol%C3%A1,%20estou%20iniciando%20uma%20conversa%20pelo%20site%20do%20SindiprosanABC">
            <Button className="bg-[#d29531] hover:bg-[#d29531]/90">
              Fale Conosco
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
