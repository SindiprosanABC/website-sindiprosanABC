import Link from 'next/link';
import { Button } from '@/components/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Notícia não encontrada
        </h1>
        <p className="mt-4 text-gray-600">
          A notícia que você está procurando não existe ou foi removida.
        </p>
        <Link href="/" className="mt-8 inline-block">
          <Button className="bg-[#2e4b89] hover:bg-[#1e3a6b]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o início
          </Button>
        </Link>
      </div>
    </div>
  );
}
