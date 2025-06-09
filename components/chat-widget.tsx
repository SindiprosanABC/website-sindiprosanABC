"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    MeuComponente: {
      init: (containerId: string, props: any) => any;
    };
  }
}
export function ChatWidget() {
  // CÓDIGO ADICIONADO - Inicialização do componente e estado para controlar se o componente foi carregado
  const containerRef = useRef<HTMLDivElement>(null);
  const [componentLoaded, setComponentLoaded] = useState(false);
  const initializeComponent = () => {
    if (window.MeuComponente && containerRef.current) {
      try {
        window.MeuComponente.init(containerRef.current.id, {
          customerId: "S59A7X9LgkC9xn3CCzbp", // id mockado para onde as mensagens vão ser enviadas
          agent: "João", // por enquanto não tem impacto mas futuramente vai ser o nome do atendente que vai iniciar o atendimento
          headerTitle: "Manybot",
          tooltipText: "Precisa de ajuda ?",
          initialMessage:
            "Olá, eu sou a Rapha, atendente IA aqui da Manycontent",
          chatButtonIcon: "/manyrobot-profile.png",
        });
      } catch (error) {
        console.error("Erro ao inicializar MeuComponente:", error);
      }
    }
  };
  useEffect(() => {
    if (componentLoaded) {
      initializeComponent();
    }
  }, [componentLoaded]);
  // Adiciona o CSS diretamente no componente (alternativa ao link no Head)
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://unpkg.com/react-chatbotify@2.0.0-beta.26/dist/style.css";
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  const mainContent = (
    <div className="flex flex-col">
      <div className="flex">
        <section className="viewportHeight relative w-full overflow-x-hidden overflow-y-auto">
          {/* CÓDIGO ADICIONADO */}
          <div>
            <div id="chat-container" ref={containerRef}></div>

            <Script
              src="https://chatify-leotelless-leotelless-projects.vercel.app/meu-componente/dist/meu-componente.umd.js"
              strategy="afterInteractive"
              onLoad={() => {
                setComponentLoaded(true);
              }}
            />
          </div>
          {/* FIM CÓDIGO ADICIONADO */}
        </section>
      </div>
    </div>
  );
  return <div className="relative">{mainContent}</div>;
}
