import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/top-bar";
import { Navbar } from "@/components/sections/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PharmReps Union - Pharmaceutical Sales Representatives Union",
  description:
    "The leading union dedicated to protecting the rights, advancing the careers, and enhancing the well-being of pharmaceutical sales professionals.",
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
      </body>
    </html>
  );
}
