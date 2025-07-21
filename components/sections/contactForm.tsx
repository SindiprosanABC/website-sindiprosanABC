"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "../button";
import { Input } from "../ui/input";
import { LoaderCircle } from "lucide-react";

// Caso queira usar um hook de toast, você pode descomentar esta linha e o código relacionado:
// import { useToast } from "@/hooks/use-toast";

type FormValues = {
  name: string;
  email: string;
  category: string;
  phone: string;
  message: string;
  resume: FileList;
};

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const [loading] = useState(false);
  // const { toast } = useToast();

  const fileName = watch("resume")?.[0]?.name;

  const onSubmit = async (data: FormValues) => {
    // setLoading(true);
    // try {
    //   const formData = new FormData();
    //   formData.append("name", data.name);
    //   formData.append("email", data.email);
    //   formData.append("category", data.category);
    //   formData.append("phone", data.phone);
    //   formData.append("message", data.message);
    //   formData.append("resume", data.resume[0]); // Anexa o arquivo
    //   const response = await fetch("http://localhost:3000/api/sendEmail", {
    //     method: "POST",
    //     body: formData,
    //   });
    //   if (!response.ok) {
    //     throw new Error("Erro ao enviar o email.");
    //   }
    //   // toast({ description: "Email enviado com sucesso" });
    //   alert("Email enviado com sucesso!"); // Substituição simples para o toast
    //   reset(); // Limpa o formulário após o sucesso
    // } catch (error) {
    //   // toast({
    //   //   title: "Email não foi enviado",
    //   //   description: "Aconteceu algo de errado",
    //   //   variant: "destructive",
    //   // });
    //   alert("Erro ao enviar o email. Por favor, tente novamente."); // Substituição simples para o toast
    // } finally {
    //   setLoading(false);
    // }
    console.log(data);
  };

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
              Deixe suas informações de contato, envie o formulário e coloque
              sua carreira em destaque na indústria farmacêutica.
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 text-gray-900 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    {...register("name", { required: true })}
                    className="w-full border-gray-300 focus:border-[#2e4b89] focus:ring-[#2e4b89]"
                    placeholder="Digite seu nome"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      Nome é obrigatório.
                    </p>
                  )}
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
                    {...register("email", { required: true })}
                    className="w-full border-gray-300 focus:border-[#2e4b89] focus:ring-[#2e4b89]"
                    placeholder="seu.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      Email é obrigatório.
                    </p>
                  )}
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
                    {...register("category", { required: true })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#2e4b89] focus:ring-[#2e4b89] focus:outline-none"
                  >
                    <option value="" disabled>
                      Selecione um assunto
                    </option>
                    <option value="Ouvidoria">Ouvidoria</option>
                    <option value="Associa-se">Associa-se</option>
                    <option value="Fale Conosco">Fale Conosco</option>
                    <option value="Enviar Currículo">Enviar Currículo</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">
                      Assunto é obrigatório.
                    </p>
                  )}
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
                      {...register("resume", { required: true })}
                      className="hidden"
                    />
                    <span className="ml-3 text-sm text-gray-500">
                      {fileName || "Nenhum arquivo selecionado"}
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
                    {...register("phone", { required: true })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#2e4b89] focus:ring-[#2e4b89] focus:outline-none"
                    placeholder="Digite seu telefone"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      Telefone é obrigatório.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#2e4b89]"
                >
                  Mensagem:
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register("message", { required: true })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Escreva sua mensagem aqui..."
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  disabled={loading}
                  className={`bg-primary-yellow px-6 py-3 font-semibold transition-all duration-300 ${loading ? "cursor-not-allowed opacity-75" : ""}`}
                >
                  {loading ? (
                    <LoaderCircle className="animate-spin" size={24} />
                  ) : (
                    "Enviar informações"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
