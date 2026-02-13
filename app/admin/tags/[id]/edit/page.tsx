'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/button';

// Form validation schema
const updateTagFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  description: z.string().max(200, 'Descrição muito longa').optional(),
  order: z.number().int().positive().optional(),
  isActive: z.boolean(),
});

type UpdateTagFormData = z.infer<typeof updateTagFormSchema>;

type Tag = {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  order: number;
  isActive: boolean;
};

const presetColors = [
  { name: 'Azul', value: '#2e4b89' },
  { name: 'Verde', value: '#16a34a' },
  { name: 'Vermelho', value: '#dc2626' },
  { name: 'Roxo', value: '#9333ea' },
  { name: 'Laranja', value: '#f59e0b' },
  { name: 'Cinza', value: '#6b7280' },
];

export default function EditTagPage() {
  const router = useRouter();
  const params = useParams();
  const tagId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [originalTag, setOriginalTag] = useState<Tag | null>(null);
  const [usageCount, setUsageCount] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<UpdateTagFormData>({
    resolver: zodResolver(updateTagFormSchema),
  });

  // Watch fields
  const nameValue = watch('name');
  const colorValue = watch('color');

  // Load tag data
  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await fetch(`/api/tags?all=true`);
        if (!response.ok) throw new Error('Erro ao carregar tag');

        const data = await response.json();
        const tag = data.tags.find((t: Tag) => t._id === tagId);

        if (!tag) {
          throw new Error('Tag não encontrada');
        }

        setOriginalTag(tag);
        reset({
          name: tag.name,
          color: tag.color,
          description: tag.description || '',
          order: tag.order,
          isActive: tag.isActive,
        });

        // Get usage count
        const newsResponse = await fetch('/api/news?all=true');
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          const count = newsData.news.filter((n: any) => n.tag === tag.name).length;
          setUsageCount(count);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar tag');
      } finally {
        setLoading(false);
      }
    };

    fetchTag();
  }, [tagId, reset]);

  const onSubmit = async (data: UpdateTagFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/tags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: tagId,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao atualizar tag');
      }

      router.push('/admin/tags');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar tag');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#2e4b89] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando tag...</p>
        </div>
      </div>
    );
  }

  if (!originalTag) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-red-800">Tag não encontrada</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/tags">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Editar Tag</h1>
          <p className="text-sm text-gray-600">Alterar informações da tag</p>
        </div>
      </div>

      {/* Usage Warning */}
      {nameValue !== originalTag.name && usageCount > 0 && (
        <div className="flex gap-3 rounded-lg bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              ⚠️ Renomear esta tag atualizará {usageCount} notícia(s) automaticamente
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Todas as notícias que usam esta tag serão atualizadas com o novo nome.
            </p>
          </div>
        </div>
      )}

      {/* Usage Info */}
      {usageCount > 0 && (
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            📊 Esta tag é usada em <strong>{usageCount}</strong> notícia(s)
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2e4b89] focus:outline-none focus:ring-[#2e4b89]"
            placeholder="Ex: Notícias da indústria"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Cor *
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {presetColors.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setValue('color', preset.value)}
                className={`flex h-10 w-10 items-center justify-center rounded-md border-2 transition-all ${
                  colorValue === preset.value ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : 'border-gray-200'
                }`}
                style={{ backgroundColor: preset.value }}
                title={preset.name}
              >
                {colorValue === preset.value && (
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
            <input
              id="color"
              type="color"
              {...register('color')}
              className="h-10 w-10 cursor-pointer rounded-md border-2 border-gray-200"
              title="Escolher cor customizada"
            />
          </div>
          {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>}
        </div>

        {/* Badge Preview */}
        {nameValue && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="mt-2">
              <span
                className="inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white"
                style={{ backgroundColor: colorValue }}
              >
                {nameValue}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição (opcional)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2e4b89] focus:outline-none focus:ring-[#2e4b89]"
            placeholder="Descrição opcional para ajudar a identificar o propósito da tag"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Order */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">
            Ordem
          </label>
          <input
            id="order"
            type="number"
            {...register('order')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2e4b89] focus:outline-none focus:ring-[#2e4b89]"
            min="1"
          />
          <p className="mt-1 text-xs text-gray-500">
            Ordem de exibição nos dropdowns (menor número aparece primeiro)
          </p>
          {errors.order && <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>}
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Tag ativa
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-6">
          <Link href="/admin/tags" className="flex-1">
            <Button variant="outline" type="button" className="w-full">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#2e4b89] hover:bg-[#1e3a6b]">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
}
