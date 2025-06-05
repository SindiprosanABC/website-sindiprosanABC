import Link from "next/link";
import { Button } from "../button";
import { Mail, MapPin, Phone } from "lucide-react";
import { Input } from "../ui/input";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-16 pb-8 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex h-20 w-20 items-center justify-center md:h-24 md:w-24">
                <Image
                  src={"/sind-branco.png"}
                  alt="logo SindiprosanABC"
                  width={600}
                  height={311}
                  className="w-full"
                />
              </div>
            </Link>
            <p className="mb-6 text-gray-400">
              Advogando os direitos e o desenvolvimento profissional de
              representantes de vendas farmacêuticas desde 1995. Facebook
              Twitter Instagram.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-transparent hover:text-[#d29531]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-transparent hover:text-[#d29531]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-transparent hover:text-[#d29531]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-transparent hover:text-[#d29531]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#about"
                  className="text-gray-400 transition-colors hover:text-[#d29531]"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/#benefits"
                  className="text-gray-400 transition-colors hover:text-[#d29531]"
                >
                  Benefícios
                </Link>
              </li>
              <li>
                <Link
                  href="/#education"
                  className="text-gray-400 transition-colors hover:text-[#d29531]"
                >
                  Educação
                </Link>
              </li>
              <li>
                <Link
                  href="/#news"
                  className="text-gray-400 transition-colors hover:text-[#d29531]"
                >
                  Notícias
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-gray-400 transition-colors hover:text-[#d29531]"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-bold">Informações de contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-[#d29531]" />
                <span className="text-gray-400">(13) 3221-2796</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-[#d29531]" />
                <span className="text-gray-400">
                  sindiprosan-abc@sindiprosan-abc.org.br
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-center md:flex-row">
            <p className="mb-4 text-sm text-gray-500 md:mb-0">
              © 2025 SindiprosanABC - Todos os direitos reservados.
            </p>
            {/* <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 transition-colors hover:text-[#d29531]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 transition-colors hover:text-[#d29531]"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="text-sm text-gray-500 transition-colors hover:text-[#d29531]"
              >
                Sitemap
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};
