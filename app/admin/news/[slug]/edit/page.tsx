'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
const updateNewsFormSchema = z.object({
  title: z.string().min(10, 'Título deve ter no mínimo 10 caracteres').max(200, 'Título muito longo'),
  description: z.string().min(20, 'Descrição deve ter no mínimo 20 caracteres').max(500, 'Descrição muito longa'),
  tag: z.string().min(1, 'Tag é obrigatória'),
  category: z.string(),
  publishedAt: z.string(),
  isActive: z.boolean(),
});

type UpdateNewsFormData = z.infer<typeof updateNewsFormSchema>;

type Tag = {
  name: string;
  color: string;
  isActive: boolean;
};

type NewsArticle = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tag: string;
  category: string;
  imageSrc: string;
  publishedAt: string;
  isActive: boolean;
};

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
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
    reset,
    watch,
  } = useForm<UpdateNewsFormData>({
    resolver: zodResolver(updateNewsFormSchema),
  });

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags?all=true');
        const data = await response.json();
        // Include all tags (active and inactive) so existing tag is preserved
        setTags(data.tags || []);
      } catch (err) {
        console.error('Erro ao carregar tags:', err);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/news?slug=${slug}&all=true`);
        if (!response.ok) {
          throw new Error('Notícia não encontrada');
        }

        // Find the full article with _id
        const allResponse = await fetch('/api/news?all=true');
        const allData = await allResponse.json();
        const fullArticle = allData.news.find((a: any) => a.slug === slug);

        if (!fullArticle) {
          throw new Error('Notícia não encontrada');
        }

        setArticle(fullArticle);
        setContent(fullArticle.content || '');
        setImagePreview(fullArticle.imageSrc);

        // Reset form with article data
        reset({
          title: fullArticle.title,
          description: fullArticle.description || fullArticle.bodyText,
          tag: fullArticle.tag,
          category: fullArticle.category || 'medicina',
          publishedAt: new Date(fullArticle.publishedAt).toISOString().split('T')[0],
          isActive: fullArticle.isActive ?? true,
        });
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar notícia');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, reset]);

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
    setImagePreview(article?.imageSrc || '');
  };

  const onSubmit = async (data: UpdateNewsFormData) => {
    if (!article) return;

    if (!content || content.trim().length < 50) {
      setError('O conteúdo deve ter no mínimo 50 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let imageSrc = article.imageSrc;

      // Upload new image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload da imagem');
        }

        const uploadData = await uploadResponse.json();
        imageSrc = uploadData.url;
      }

      // Update news article
      const newsData = {
        _id: article._id,
        ...data,
        content,
        imageSrc,
        publishedAt: new Date(data.publishedAt).toISOString(),
      };

      const updateResponse = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'Erro ao atualizar notícia');
      }

      // Success - redirect to list
      router.push('/admin/news');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar notícia');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#2e4b89] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando notícia...</p>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-red-800">{error}</p>
        <Link href="/admin/news" className="mt-4 inline-block">
          <Button variant="outline">Voltar para lista</Button>
        </Link>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-800">Editar Notícia</h1>
          <p className="text-sm text-gray-600">
            Atualize as informações da notícia
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
                  {tag.name} {!tag.isActive ? '(Inativa)' : ''}
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
            <div className="relative">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute right-2 top-2 flex gap-2">
                {imageFile && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="rounded-full bg-gray-500 p-2 text-white shadow-lg hover:bg-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <label
                  htmlFor="image"
                  className="cursor-pointer rounded-full bg-[#2e4b89] p-2 text-white shadow-lg hover:bg-[#1e3a6b]"
                >
                  <Upload className="h-4 w-4" />
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Clique no ícone para trocar a imagem (PNG, JPG, WEBP até 2MB)
            </p>
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
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
