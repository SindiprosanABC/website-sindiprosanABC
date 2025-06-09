import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export const TopBar = () => {
  return (
    <div className="bg-primary-blue flex items-center justify-between px-4 py-2 text-sm text-white md:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/contact"
          className="flex items-center gap-1 transition-colors hover:text-[#d29531]"
        >
          <Phone className="h-3 w-3" />
          <span className="hidden sm:inline">(013) 3877-7780</span>
        </Link>
        <Link
          href="/contact"
          className="flex items-center gap-1 transition-colors hover:text-[#d29531]"
        >
          <Mail className="h-3 w-3" />
          <span className="hidden sm:inline">
            sindiprosan-abc@sindiprosan-abc.org.br
          </span>
        </Link>
      </div>
    </div>
  );
};
