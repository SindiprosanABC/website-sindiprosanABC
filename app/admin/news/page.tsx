'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/button';
import { Pagination } from '@/components/ui/pagination';

type NewsArticle = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tag: string;
  imageSrc: string;
  date: string;
  publishedAt: string;
  isActive: boolean;
};

const ITEMS_PER_PAGE = 6;

export default function AdminNewsListPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    tag: '',
  });
  const [availableTags, setAvailableTags] = useState<Array<{ name: string; _id: string }>>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const fetchNews = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        all: 'true',
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.tag) params.append('tag', filters.tag);

      const response = await fetch(`/api/news?${params}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar notícias');
      }
      const data = await response.json();
      setNews(data.news || []);
      setTotalItems(data.pagination?.total || 0);
      setCurrentPage(page);
    } catch (err) {
      setError('Erro ao carregar notícias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags?all=true&limit=999');
      const data = await response.json();
      setAvailableTags(data.tags || []);
    } catch (err) {
      console.error('Erro ao carregar tags:', err);
    } finally {
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchNews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handlePageChange = (page: number) => {
    fetchNews(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (field: 'search' | 'status' | 'tag', value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', tag: '' });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: id,
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      // Update local state
      setNews((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: !currentStatus } : item
        )
      );
    } catch (err) {
      alert('Erro ao atualizar status da notícia');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir notícia');
      }

      // Refetch from database to ensure sync
      await fetchNews();
      setDeleteConfirm(null);
    } catch (err) {
      alert('Erro ao excluir notícia');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#2e4b89] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Gerenciar Notícias
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {totalItems} notícia{totalItems !== 1 ? 's' : ''} no total
          </p>
        </div>
        <Link href="/admin/news/create" className="w-full sm:w-auto">
          <Button className="w-full bg-[#2e4b89] hover:bg-[#1e3a6b] sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Nova Notícia
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-[#2e4b89] focus:outline-none focus:ring-2 focus:ring-[#2e4b89]/20"
              />
            </div>
          </div>

          {/* Tag Select */}
          <div className="lg:w-48">
            <select
              value={filters.tag}
              onChange={(e) => handleFilterChange('tag', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#2e4b89] focus:outline-none focus:ring-2 focus:ring-[#2e4b89]/20"
              disabled={loadingTags}
            >
              <option value="">Todas as tags</option>
              {availableTags.map((tag) => (
                <option key={tag._id} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="lg:w-40">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#2e4b89] focus:outline-none focus:ring-2 focus:ring-[#2e4b89]/20"
            >
              <option value="">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          {/* Clear Button */}
          {(filters.search || filters.status || filters.tag) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="lg:w-auto"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* News List */}
      {news.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Nenhuma notícia encontrada
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Comece criando sua primeira notícia.
          </p>
          <Link href="/admin/news/create">
            <Button className="mt-4 bg-[#2e4b89] hover:bg-[#1e3a6b]">
              <Plus className="mr-2 h-5 w-5" />
              Criar Primeira Notícia
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout - Visible on small screens */}
          <div className="block space-y-4 lg:hidden">
            {news.map((article) => (
              <div key={article._id} className="rounded-lg border bg-white p-4 shadow-sm">
                {/* Image */}
                <div className="relative mb-3 h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={article.imageSrc}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {/* Title & Description */}
                  <div>
                    <h3 className="break-words font-semibold text-gray-900">{article.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{article.description}</p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                      {article.tag}
                    </span>
                    {article.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        <Eye className="h-3 w-3" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                        <EyeOff className="h-3 w-3" />
                        Inativo
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 border-t pt-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/news/${article.slug}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(article._id, article.isActive)}
                        className="flex-1"
                      >
                        {article.isActive ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Ativar
                          </>
                        )}
                      </Button>
                    </div>
                    {deleteConfirm === article._id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDelete(article._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(article._id)}
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden rounded-lg bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Imagem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {news.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="relative h-16 w-24 overflow-hidden rounded">
                        <Image
                          src={article.imageSrc}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[180px] lg:max-w-[200px] xl:max-w-[280px] 2xl:max-w-sm">
                        <p className="truncate font-medium text-gray-900">
                          {article.title}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {article.description}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                        {article.tag}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {article.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {article.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                          <Eye className="h-3 w-3" />
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                          <EyeOff className="h-3 w-3" />
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="min-w-[200px] whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {deleteConfirm === article._id ? (
                          <>
                            <button
                              onClick={() => handleDelete(article._id)}
                              className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-300"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <Link href={`/admin/news/${article.slug}/edit`}>
                              <button
                                title="Editar"
                                className="rounded p-1 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                            </Link>
                            <button
                              title={
                                article.isActive ? 'Desativar' : 'Ativar'
                              }
                              onClick={() =>
                                handleToggleActive(article._id, article.isActive)
                              }
                              className="rounded p-1 text-yellow-600 hover:bg-yellow-50"
                            >
                              {article.isActive ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              title="Excluir"
                              onClick={() => setDeleteConfirm(article._id)}
                              className="rounded p-1 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={totalItems}
          />
        </div>
      </>
      )}
    </div>
  );
}
