"use client";

import { useState } from "react";
import { Filter, Wifi, Briefcase, ChevronDown, ChevronUp, Calendar, MapPin } from "lucide-react";

const REGION_LOCATION_MAP: Record<string, string> = {
  ABC: "Santo André|São Bernardo|São Caetano|Diadema|Mauá|Ribeirão Pires|Rio Grande da Serra",
  "Baixada Santista": "Santos|São Vicente|Guarujá|Cubatão|Praia Grande|Bertioga|Itanhaém|Mongaguá|Peruíbe",
  Litoral: "Caraguatatuba|Ubatuba|São Sebastião|Ilhabela",
};

interface FilterSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
}

interface JobsFilterProps {
  onRegionChange: (locationRegex: string | null) => void;
}

export default function JobsFilter({ onRegionChange }: JobsFilterProps) {
  const [sections, setSections] = useState<FilterSection[]>([
    { id: "regiao", title: "Região", icon: <MapPin className="w-4 h-4" />, isOpen: true },
    { id: "modalidade", title: "Modalidade", icon: <Wifi className="w-4 h-4" />, isOpen: true },
    { id: "tipo", title: "Tipo de vaga", icon: <Briefcase className="w-4 h-4" />, isOpen: true },
    { id: "data", title: "Data de publicação", icon: <Calendar className="w-4 h-4" />, isOpen: true },
  ]);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, isOpen: !section.isOpen } : section
    ));
  };

  const handleRegionChange = (region: string) => {
    const next = selectedRegion === region ? null : region;
    setSelectedRegion(next);
    onRegionChange(next ? REGION_LOCATION_MAP[next] : null);
  };

  return (
    <aside className="w-full lg:w-[300px] bg-white border border-gray-200 rounded-xl p-6 h-fit lg:sticky lg:top-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-[#2e4b89]" />
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
      </div>

      {/* Região Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("regiao")}
          className="flex items-center justify-between w-full py-2 px-2 -mx-2 text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Região</span>
          </div>
          {sections.find(s => s.id === "regiao")?.isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300" />
          )}
        </button>
        {sections.find(s => s.id === "regiao")?.isOpen && (
          <div className="mt-3 ml-6 space-y-2">
            {Object.keys(REGION_LOCATION_MAP).map((region) => (
              <label key={region} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
                <input
                  type="checkbox"
                  checked={selectedRegion === region}
                  onChange={() => handleRegionChange(region)}
                  className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
                />
                <span className="text-sm text-gray-600">{region}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Modalidade Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("modalidade")}
          className="flex items-center justify-between w-full py-2 px-2 -mx-2 text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Modalidade</span>
          </div>
          {sections.find(s => s.id === "modalidade")?.isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300" />
          )}
        </button>
        {sections.find(s => s.id === "modalidade")?.isOpen && (
          <div className="mt-3 ml-6 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm text-gray-600">Remoto</span>
            </label>
          </div>
        )}
      </div>

      {/* Tipo de vaga Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("tipo")}
          className="flex items-center justify-between w-full py-2 px-2 -mx-2 text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Tipo de vaga</span>
          </div>
          {sections.find(s => s.id === "tipo")?.isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300" />
          )}
        </button>
        {sections.find(s => s.id === "tipo")?.isOpen && (
          <div className="mt-3 ml-6 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm text-gray-600">Tempo integral</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm text-gray-600">Meio período</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm text-gray-600">Contrato</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm text-gray-600">Estágio</span>
            </label>
          </div>
        )}
      </div>

      {/* Data de publicação Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("data")}
          className="flex items-center justify-between w-full py-2 px-2 -mx-2 text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Data de publicação</span>
          </div>
          {sections.find(s => s.id === "data")?.isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300" />
          )}
        </button>
        {sections.find(s => s.id === "data")?.isOpen && (
          <div className="mt-3 ml-6 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm text-gray-600">Ontem</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm text-gray-600">Nos últimos 3 dias</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm text-gray-600">Semana passada</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md px-2 py-1 -mx-2 -my-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm text-gray-600">Mês passado</span>
            </label>
          </div>
        )}
      </div>
    </aside>
  );
}
