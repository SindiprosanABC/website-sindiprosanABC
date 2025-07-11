"use client";
import Link from "next/link";
import { Button } from "../button";

export const AttentionCTA = () => {
  return (
    <section className="bg-[#a74926] px-16 py-16">
      <div className="flex flex-col gap-6">
        <div className="space-y-1 text-center">
          <p className="text-lg font-medium text-[#e6e9f9]">
            DENÚNCIA – Sua Voz Importa!
          </p>
          <h3 className="text-center text-2xl font-bold text-white md:text-3xl">
            Se você tem algo a denunciar, o SINDIPROSAN-ABC está ao seu lado
            para te ouvir e auxiliar, faça a sua denúncia de forma anônima
          </h3>
        </div>
        <div className="flex justify-center">
          <Link href="https://wa.me/551338777780?text=Ol%C3%A1,%20estou%20iniciando%20uma%20conversa%20pelo%20site%20do%20SindiprosanABC">
            <Button size="lg" className="bg-[#d29531] hover:bg-[#d29531]/90">
              Fale Conosco
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
