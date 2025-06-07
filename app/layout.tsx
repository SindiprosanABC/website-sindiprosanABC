import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/top-bar";
import { Navbar } from "@/components/sections/navbar";
import { ChatWidget } from "@/components/chat-widget";
import { Footer } from "@/components/sections/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SindiprosanABC - Fortalecendo a categoria farmacêutica",
  description:
    "A defesa dos Propagandistas, Propagandistas Vendedores e Vendedores de Produtos Farmacêuticos no ABC, Baixada Santista e litoral",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <TopBar />
        <Navbar />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
