import { Mail } from "lucide-react"; // Only Mail is needed now since Phone icon is replaced by Image
import Image from "next/image";
import Link from "next/link";

export const TopBar = () => {
  const whatsappNumber = "551338777780";
  const emailAddress = "sindiprosan-abc@sindiprosan-abc.org.br";

  return (
    <div className="bg-primary-blue flex items-center justify-between px-4 py-3 text-sm text-white md:px-8">
      <div className="flex items-center gap-6">
        {/* WhatsApp Link */}
        <Link
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank" // Opens in a new tab
          rel="noopener noreferrer"
          className="group flex items-center gap-2 transition-colors hover:text-[#d29531]"
        >
          <Image
            src={"/wpp-icon.svg"}
            width={56}
            height={56}
            alt="WhatsApp icon"
            className="group h-4 w-4 group-hover:bg-[#d29531]"
          />
          <span className="hidden sm:inline">(013) 3877-7780</span>
        </Link>

        <Link
          href={`mailto:${emailAddress}`}
          className="flex items-center gap-2 transition-colors hover:text-[#d29531]"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">
            sindiprosan-abc@sindiprosan-abc.org.br
          </span>
        </Link>
      </div>
    </div>
  );
};
