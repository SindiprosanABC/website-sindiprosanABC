import { Button } from "../button";
import { Input } from "../ui/input";

export const ContactForm = () => {
  return (
    <section id="contact" className="bg-[#2e4b89] py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Entre em contato
            </h2>
            <div className="mx-auto mb-6 h-1 w-16 bg-[#d29531]"></div>
            <p className="mx-auto max-w-2xl text-xl text-white/90">
              Deixe sua informações de contato, envie o formulário e coloque sua
              carreira em destaque na indústria farmacêutica.
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 text-gray-900 md:p-12">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#2e4b89]"
                  >
                    Nome: *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    className="w-full border-gray-300 focus:border-[#2e4b89] focus:ring-[#2e4b89]"
                    placeholder="Digite seu nome"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#2e4b89]"
                  >
                    E-mail: *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="w-full border-gray-300 focus:border-[#2e4b89] focus:ring-[#2e4b89]"
                    placeholder="seu.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="Empresa"
                    className="mb-2 block text-sm font-medium text-[#2e4b89]"
                  >
                    Empresa: *
                  </label>
                  <Input
                    id="company"
                    type="text"
                    required
                    className="w-full border-gray-300 focus:border-[#2e4b89] focus:ring-[#2e4b89]"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-[#2e4b89]"
                  >
                    Telefone: *
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    className="w-full border-gray-300 focus:border-[#2e4b89] focus:ring-[#2e4b89]"
                    placeholder="(00) 0000-0000"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#2e4b89]"
                >
                  Message: *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  required
                  className="focus\\ w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <Button className="bg-primary-yellow">
                  Enviar informações
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
