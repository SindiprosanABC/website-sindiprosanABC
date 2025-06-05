import { Button } from "../button";

export const CallToAction = () => {
  return (
    <section className="bg-[#2e4b89] py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Faça parte do SindiprosanABC hoje
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl">
          Seja parte de uma comunidade dedicada a avançar com os interesses dos
          representantes de vendas farmacêuticos
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-[#d29531] hover:bg-[#d29531]/90">
            Fale conosco
          </Button>
        </div>
      </div>
    </section>
  );
};
