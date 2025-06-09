"use client";
import { Button } from "../button";

export const CollectiveAgreement = () => {
  const handleOpenPdf = () => {
    const pdfPath = "/CCT-FIP-2025_2027-Clicksign.pdf";

    window.open(pdfPath, "_blank");
  };

  return (
    <section className="bg-[#2e4b89] px-16 py-16">
      <div className="flex flex-col gap-6">
        <div className="space-y-1 text-center">
          <p className="text-lg font-medium text-[#e6e9f9]">
            Convenção coletiva Atualizada
          </p>
          <h3 className="text-center text-2xl font-bold text-white md:text-3xl">
            Consulte aqui a sua última convenção coletiva atualizada (2025/2026)
          </h3>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleOpenPdf}
            size="lg"
            className="bg-[#d29531] hover:bg-[#d29531]/90"
          >
            Visualizar PDF
          </Button>
        </div>
      </div>
    </section>
  );
};
