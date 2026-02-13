'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/ui/input';
import TipTapEditor from '@/components/editor/tiptap-editor';

// Form validation schema
// Note: 'content' is validated manually in onSubmit since it's managed by TipTap editor
const createNewsFormSchema = z.object({
  title: z.string().min(10, 'Título deve ter no mínimo 10 caracteres').max(200, 'Título muito longo'),
  description: z.string().min(20, 'Descrição deve ter no mínimo 20 caracteres').max(500, 'Descrição muito longa'),
  tag: z.string().min(1, 'Tag é obrigatória'),
  category: z.string(),
  publishedAt: z.string(),
  isActive: z.boolean(),
});

type CreateNewsFormData = z.infer<typeof createNewsFormSchema>;

type Tag = {
  name: string;
  color: string;
};

export default function CreateNewsPage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateNewsFormData>({
    resolver: zodResolver(createNewsFormSchema),
    defaultValues: {
      category: 'medicina',
      publishedAt: new Date().toISOString().split('T')[0],
      isActive: true,
    },
  });

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags?activeOnly=true');
        const data = await response.json();
        setTags(data.tags || []);
      } catch (err) {
        console.error('Erro ao carregar tags:', err);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2MB');
      return;
    }

    setImageFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const onSubmit = async (data: CreateNewsFormData) => {
    if (!imageFile) {
      setError('Por favor, selecione uma imagem');
      return;
    }

    if (!content || content.trim().length < 50) {
      setError('O conteúdo deve ter no mínimo 50 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const { url: imageSrc } = await uploadResponse.json();

      // 2. Create news article
      const newsData = {
        ...data,
        content,
        imageSrc,
        publishedAt: new Date(data.publishedAt).toISOString(),
      };

      const createResponse = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Erro ao criar notícia');
      }

      // Success - redirect to list
      router.push('/admin/news');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar notícia');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nova Notícia</h1>
          <p className="text-sm text-gray-600">
            Preencha os campos abaixo para criar uma nova notícia
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
              Título *
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Digite o título da notícia"
              className="w-full"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
              Descrição Curta *
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Escreva uma breve descrição da notícia"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#2e4b89] focus:outline-none focus:ring-1 focus:ring-[#2e4b89]"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Content - TipTap Editor */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Conteúdo Completo *
            </label>
            <TipTapEditor
              value={content}
              onChange={setContent}
              placeholder="Escreva o conteúdo completo da notícia..."
            />
            {content.trim().length < 50 && content.trim().length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                Mínimo de 50 caracteres (atual: {content.trim().length})
              </p>
            )}
          </div>

          {/* Tag */}
          <div className="mb-4">
            <label htmlFor="tag" className="mb-2 block text-sm font-medium text-gray-700">
              Tag *
            </label>
            <select
              id="tag"
              {...register('tag')}
              disabled={loadingTags}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#2e4b89] focus:outline-none focus:ring-1 focus:ring-[#2e4b89] disabled:bg-gray-100"
            >
              <option value="">
                {loadingTags ? 'Carregando tags...' : 'Selecione uma tag'}
              </option>
              {tags.map((tag) => (
                <option key={tag.name} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
            {errors.tag && (
              <p className="mt-1 text-sm text-red-600">{errors.tag.message}</p>
            )}
            {/* Badge Preview */}
            {watch('tag') && (
              <div className="mt-2">
                <span
                  className="inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white"
                  style={{
                    backgroundColor:
                      tags.find((t) => t.name === watch('tag'))?.color || '#6b7280',
                  }}
                >
                  {watch('tag')}
                </span>
              </div>
            )}
          </div>

          {/* Category (hidden, default to medicina) */}
          <input type="hidden" {...register('category')} value="medicina" />

          {/* Image Upload */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Imagem de Capa *
            </label>
            {imagePreview ? (
              <div className="relative">
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white shadow-lg hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label
                      htmlFor="image"
                      className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-[#2e4b89] hover:bg-gray-50"
                    >
                      Selecionar Imagem
                    </label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, WEBP até 2MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Published Date */}
          <div className="mb-4">
            <label htmlFor="publishedAt" className="mb-2 block text-sm font-medium text-gray-700">
              Data de Publicação *
            </label>
            <Input
              id="publishedAt"
              type="date"
              {...register('publishedAt')}
              className="w-full"
            />
            {errors.publishedAt && (
              <p className="mt-1 text-sm text-red-600">{errors.publishedAt.message}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('isActive')}
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-[#2e4b89] focus:ring-[#2e4b89]"
              />
              <span className="text-sm font-medium text-gray-700">
                Publicar notícia (ativa)
              </span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Se desmarcado, a notícia será salva como rascunho
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/news">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2e4b89] hover:bg-[#1e3a6b]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Notícia'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
