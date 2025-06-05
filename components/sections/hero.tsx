import Image from "next/image";
import { Badge } from "../badge";
import { Button } from "../button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#2e4b89] text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2e4b89]/90 to-[#2e4b89]/70"></div>
      <div className="absolute inset-0">
        <Image
          src="/pharmaceuticsRepresentativePeople.png"
          alt="Pharmaceutical representatives in a meeting"
          width={1200}
          height={600}
          className="h-full w-full object-cover opacity-20 2xl:object-fill"
          priority
        />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-32 xl:py-52 2xl:py-60">
        <div className="max-w-3xl">
          <Badge className="mb-4 bg-[#d29531] hover:bg-[#d29531]/90">
            Sindiprosan-ABC - Fortalecendo a categoria e garantindo seus
            direitos
          </Badge>
          <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
            Unindo representantes farmacêuticos para um futuro melhor
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            A defesa dos Propagandistas, Propagandistas Vendedores e Vendedores
            de Produtos Farmacêuticos no ABC, Baixada Santista e litoral
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="https://wa.me/551338777780?text=Ol%C3%A1,%20estou%20iniciando%20uma%20conversa%20pelo%20site%20do%20SindiprosanABC">
              <Button size="lg" className="bg-[#d29531] hover:bg-[#d29531]/90">
                Fale Conosco
              </Button>
            </Link>

            <Link href={"/#benefits"}>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#2e4b89]"
              >
                Saiba Mais
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-[#2e4b89] to-transparent"></div>
    </section>
  );
};
