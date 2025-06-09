export const Stats = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-100 bg-white p-6 text-center shadow-md">
            <p className="mb-2 text-4xl font-bold text-[#d29531]">1.000+</p>
            <p className="font-medium text-[#2e4b89]">
              Representantes Farmacêuticos
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-6 text-center shadow-md">
            <p className="mb-2 text-4xl font-bold text-[#d29531]">13+</p>
            <p className="font-medium text-[#2e4b89]">Anos no mercado</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-6 text-center shadow-md">
            <p className="mb-2 text-4xl font-bold text-[#d29531]">100+</p>
            <p className="font-medium text-[#2e4b89]">Programas Educacionais</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-6 text-center shadow-md">
            <p className="mb-2 text-4xl font-bold text-[#d29531]">50</p>
            <p className="font-medium text-[#2e4b89]">Capítulos estaduais</p>
          </div>
        </div>
      </div>
    </section>
  );
};
