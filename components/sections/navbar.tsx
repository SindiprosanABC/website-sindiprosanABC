import Link from "next/link";
import { Button } from "../button";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../sheet";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <div className="absolute inset-0 rounded-full bg-[#2e4b89]"></div>
            <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-white">
              <div className="h-6 w-6 rounded-full bg-[#d29531] md:h-8 md:w-8"></div>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2e4b89] md:text-xl">
              PharmReps
            </h1>
            <p className="-mt-1 text-xs font-medium text-[#d29531]">UNION</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/about"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            About Us
          </Link>
          <Link
            href="/benefits"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Member Benefits
          </Link>
          <Link
            href="/education"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Education
          </Link>
          <Link
            href="/advocacy"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Advocacy
          </Link>
          <Link
            href="/events"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Events
          </Link>
          <Link
            href="/news"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            News
          </Link>
          <Link
            href="/contact"
            className="font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-[#2e4b89] text-[#2e4b89]"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <Button className="hidden bg-[#d29531] hover:bg-[#d29531]/90 md:flex">
            Join Now
          </Button>

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
                  href="/about"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  About Us
                </Link>
                <Link
                  href="/benefits"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Member Benefits
                </Link>
                <Link
                  href="/education"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Education
                </Link>
                <Link
                  href="/advocacy"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Advocacy
                </Link>
                <Link
                  href="/events"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Events
                </Link>
                <Link
                  href="/news"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  News
                </Link>
                <Link
                  href="/contact"
                  className="border-b py-2 font-medium text-[#2e4b89] transition-colors hover:text-[#d29531]"
                >
                  Contact
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
