import Link from "next/link";
import { Button } from "../button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../sheet";
import Image from "next/image";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-20 w-20 items-center justify-center md:h-24 md:w-24">
            {/* <div className="absolute inset-0 rounded-full bg-[#2e4b89]"></div>
            <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-white">
              <div className="h-6 w-6 rounded-full bg-[#d29531] md:h-8 md:w-8"></div>
            </div> */}
            <Image
              src={"/sind-color.png"}
              alt="logo SindiprosanABC"
              width={600}
              height={311}
              className="w-full"
            />
          </div>
          {/* <div>
            <h1 className="text-lg font-bold text-[#2e4b89] md:text-xl">
              PharmReps
            </h1>
            <p className="-mt-1 text-xs font-medium text-[#d29531]">UNION</p>
          </div> */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Home
          </Link>
          <Link
            href="/#about"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Sobre Nós
          </Link>
          <Link
            href="/#benefits"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Benefícios
          </Link>
          <Link
            href="/#education"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Educação
          </Link>
          <Link
            href="/#news"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Notícias
          </Link>
          <Link
            href="/#contact"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="https://wa.me/5513932212796?text=Ol%C3%A1,%20estou%20iniciando%20uma%20conversa%20pelo%20site%20do%20SindiprosanABC"
            target="_blank"
          >
            <Button className="hidden bg-[#d29531] hover:bg-[#d29531]/90 md:flex">
              Contate Nos
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-[#2e4b89] text-[#2e4b89] lg:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-6 sm:w-[400px]">
              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  href="/"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Home
                </Link>
                <Link
                  href="/#about"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Sobre Nós
                </Link>
                <Link
                  href="/#benefits"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Benefícios
                </Link>
                <Link
                  href="/#education"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Educação
                </Link>
                <Link
                  href="/#news"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Notícias
                </Link>
                <Link
                  href="/#contact"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Contato
                </Link>
                <Button className="mt-4 bg-[#d29531] hover:bg-[#d29531]/90">
                  Join Now
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
