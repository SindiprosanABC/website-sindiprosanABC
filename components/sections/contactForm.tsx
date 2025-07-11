import { Button } from "../button";
import { Input } from "../ui/input";

export const ContactForm = () => {
  return (
    <section id="contact" className="bg-[#2e4b89] pt-32 pb-24 text-white">
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
                    Nome:
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
                    E-mail:
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
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-[#2e4b89]"
                  >
                    Assunto:
                  </label>
                  <select
                    id="category"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#2e4b89] focus:ring-[#2e4b89] focus:outline-none"
                  >
                    <option value="" disabled selected>
                      Selecione um assunto
                    </option>
                    <option value="option1">Ouvidoria</option>
                    <option value="option2">Associa-se</option>
                    <option value="option3">Fale Conosco</option>
                    <option value="option3">Enviar Currículo</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="resume"
                    className="mb-2 block text-sm font-medium text-[#2e4b89]"
                  >
                    Currículo (PDF):
                  </label>
                  <div className="flex items-center">
                    <label
                      htmlFor="resume"
                      className="flex cursor-pointer items-center rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Anexar PDF
                    </label>
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                    />
                    <span className="ml-3 text-sm text-gray-500" id="file-name">
                      Nenhum arquivo selecionado
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-[#2e4b89]"
                  >
                    Telefone:
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
                  Message:
                </label>
                <textarea
                  id="message"
                  rows={6}
                  required
                  className="focus\\ w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-between">
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
