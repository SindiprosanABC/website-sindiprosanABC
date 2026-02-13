'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

type Tag = {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  order: number;
  isActive: boolean;
};

const ITEMS_PER_PAGE = 10;

export default function AdminTagsListPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const fetchTags = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        all: 'true',
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`/api/tags?${params}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar tags');
      }
      const data = await response.json();
      setTags(data.tags || []);
      setTotalItems(data.pagination?.total || 0);
      setCurrentPage(page);
    } catch (err) {
      setError('Erro ao carregar tags');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handlePageChange = (page: number) => {
    fetchTags(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (field: 'search' | 'status', value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '' });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/tags', {
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
      setTags((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: !currentStatus } : item
        )
      );
    } catch (err) {
      alert('Erro ao atualizar status da tag');
      console.error(err);
    }
  };

  const handleDelete = async (id: string, force = false) => {
    try {
      setDeleteError('');
      const response = await fetch('/api/tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, force }),
      });

      const data = await response.json();

      if (response.status === 409 && data.inUse) {
        // Tag is in use, show warning
        setDeleteError(
          `Esta tag é usada em ${data.count} notícia(s). Tem certeza que deseja excluir? Os artigos não serão afetados.`
        );
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir tag');
      }

      // Refetch from database to ensure sync
      await fetchTags();
      setDeleteConfirm(null);
      setDeleteError('');
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir tag');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#2e4b89] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando tags...</p>
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
            Gerenciar Tags
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {totalItems} tag{totalItems !== 1 ? 's' : ''} no total
          </p>
        </div>
        <Link href="/admin/tags/create" className="w-full sm:w-auto">
          <Button className="w-full bg-[#2e4b89] hover:bg-[#1e3a6b] sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            Nova Tag
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
                placeholder="Buscar por nome..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-[#2e4b89] focus:outline-none focus:ring-2 focus:ring-[#2e4b89]/20"
              />
            </div>
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
          {(filters.search || filters.status) && (
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

      {/* Tags List */}
      {tags.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Nenhuma tag encontrada
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Comece criando sua primeira tag.
          </p>
          <Link href="/admin/tags/create">
            <Button className="mt-4 bg-[#2e4b89] hover:bg-[#1e3a6b]">
              <Plus className="mr-2 h-5 w-5" />
              Criar Primeira Tag
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout - Visible on small screens */}
          <div className="block space-y-4 lg:hidden">
            {tags.map((tag) => (
              <div key={tag._id} className="rounded-lg border bg-white p-4 shadow-sm">
                {/* Badge Preview */}
                <div className="mb-3">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {/* Description */}
                  {tag.description && (
                    <p className="text-sm text-gray-600">{tag.description}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500">Ordem: {tag.order}</span>
                    {tag.isActive ? (
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
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 border-t pt-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/tags/${tag._id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(tag._id, tag.isActive)}
                        className="flex-1"
                      >
                        {tag.isActive ? (
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
                    {deleteConfirm === tag._id ? (
                      <div className="space-y-2">
                        {deleteError && (
                          <p className="text-xs text-amber-600">{deleteError}</p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDelete(tag._id, deleteError ? true : false)}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setDeleteConfirm(null);
                              setDeleteError('');
                            }}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(tag._id)}
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
                      Ordem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Badge
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Descrição
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
                  {tags.map((tag) => (
                    <tr key={tag._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {tag.order}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="max-w-xs truncate text-sm text-gray-600">
                          {tag.description || '-'}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {tag.isActive ? (
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
                          {deleteConfirm === tag._id ? (
                            <div className="flex flex-col items-end gap-2">
                              {deleteError && (
                                <p className="text-xs text-amber-600 max-w-xs text-right">
                                  {deleteError}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleDelete(tag._id, deleteError ? true : false)
                                  }
                                  className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirm(null);
                                    setDeleteError('');
                                  }}
                                  className="rounded bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-300"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Link href={`/admin/tags/${tag._id}/edit`}>
                                <button
                                  title="Editar"
                                  className="rounded p-1 text-blue-600 hover:bg-blue-50"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                              </Link>
                              <button
                                title={tag.isActive ? 'Desativar' : 'Ativar'}
                                onClick={() =>
                                  handleToggleActive(tag._id, tag.isActive)
                                }
                                className="rounded p-1 text-yellow-600 hover:bg-yellow-50"
                              >
                                {tag.isActive ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                title="Excluir"
                                onClick={() => setDeleteConfirm(tag._id)}
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
