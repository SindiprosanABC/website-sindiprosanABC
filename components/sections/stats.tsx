export const Stats = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-100 bg-white p-6 text-center shadow-md">
            <p className="mb-2 text-4xl font-bold text-[#d29531]">+1.000</p>
            <p className="font-medium text-[#2e4b89]">Propagandistas na Base</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-6 text-center shadow-md">
            <p className="mb-2 text-4xl font-bold text-[#d29531]">+13</p>
            <p className="font-medium text-[#2e4b89]">Anos de história</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-6 text-center shadow-md">
            <p className="mb-2 text-4xl font-bold text-[#d29531]">+4</p>
            <p className="font-medium text-[#2e4b89]">Salas na base</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-6 text-center shadow-md">
            <p className="mb-2 text-4xl font-bold text-[#d29531]">+35</p>
            <p className="font-medium text-[#2e4b89]">Cursos em produção</p>
          </div>
        </div>
      </div>
    </section>
  );
};
