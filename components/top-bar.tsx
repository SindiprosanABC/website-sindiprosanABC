import { Mail, Phone, User } from "lucide-react";
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
          <span className="hidden sm:inline">1-800-555-0123</span>
        </Link>
        <Link
          href="/contact"
          className="flex items-center gap-1 transition-colors hover:text-[#d29531]"
        >
          <Mail className="h-3 w-3" />
          <span className="hidden sm:inline">contact@pharmareps.org</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/member-login"
          className="flex items-center gap-1 transition-colors hover:text-[#d29531]"
        >
          <User className="h-3 w-3" />
          <span>Member Login</span>
        </Link>
      </div>
    </div>
  );
};
