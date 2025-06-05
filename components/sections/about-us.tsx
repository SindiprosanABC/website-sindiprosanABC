import Image from "next/image";

export const AboutUs = () => {
  return (
    <section id="about" className="bg-white py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Image Side */}
          <div className="relative">
            <div className="relative h-96 w-full overflow-hidden rounded-lg lg:h-[500px]">
              <Image
                src="/pharmaceuticRepresentatives-2.jpg"
                alt="Pharmaceutical sales representatives collaborating in a modern office environment"
                width={600}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Content Side */}
          <div className="rounded-lg bg-[#2e4b89] p-8 text-white lg:p-12">
            <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
              Entenda mais sobre o{" "}
              <span className="text-[#d29531]">Sindiprosan-ABC</span>
            </h2>
            <p className="mb-6 text-lg leading-relaxed">
              O Sindiprosan-ABC atua como a voz oficial dos Propagandistas,
              Propagandistas Vendedores e Vendedores de Produtos Farmacêuticos.
              Nossa abrangência inclui as cidades do ABC Paulista (Santo André,
              São Bernardo do Campo, São Caetano do Sul, Diadema, Mauá, Ribeirão
              Pires e Rio Grande da Serra), a Baixada Santista (Santos, São
              Vicente, Praia Grande, Cubatão, Guarujá, Bertioga, Peruíbe,
              Itanhaém, Mongaguá e Pedro de Toledo) e outras importantes regiões
              do litoral e interior de São Paulo. Nosso compromisso é com a
              defesa intransigente dos direitos e interesses da categoria,
              buscando sempre o fortalecimento profissional e melhores condições
              de vida para todos os nossos representados, através de um diálogo
              constante e negociações estratégicas com o setor.
            </p>

            <div>
              <h3 className="mb-6 text-xl font-bold text-[#d29531]">
                Nossas áreas
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-[#d29531]/20 bg-[#2e4b89]/50 p-3">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#d29531]">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Certificação profissional</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-[#d29531]/20 bg-[#2e4b89]/50 p-3">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#d29531]">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Assuntos regulatórios</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-[#d29531]/20 bg-[#2e4b89]/50 p-3">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#d29531]">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Suporte técnico</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-[#d29531]/20 bg-[#2e4b89]/50 p-3">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#d29531]">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">
                    Inovação e desenvolvimento
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-[#d29531]/20 bg-[#2e4b89]/50 p-3">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#d29531]">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Suporte a negócios</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-[#d29531]/20 bg-[#2e4b89]/50 p-3">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#d29531]">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Relações de trabalho</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
