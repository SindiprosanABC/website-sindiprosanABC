'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  CheckCircle,
  Calendar,
  Plus,
} from 'lucide-react';

type NewsStats = {
  total: number;
  active: number;
  thisMonth: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<NewsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/news/stats');
        if (!response.ok) {
          throw new Error('Erro ao carregar estatísticas');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Erro ao carregar estatísticas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#2e4b89] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
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

  const statCards = [
    {
      title: 'Total de Notícias',
      value: stats?.total || 0,
      icon: Newspaper,
      color: 'bg-blue-500',
      description: 'Total no sistema',
    },
    {
      title: 'Notícias Ativas',
      value: stats?.active || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Visíveis no site',
    },
    {
      title: 'Criadas Este Mês',
      value: stats?.thisMonth || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      description: 'Desde o início do mês',
    },
  ];

  const quickActions = [
    {
      title: 'Nova Notícia',
      description: 'Criar uma nova notícia',
      href: '/admin/news/create',
      icon: Plus,
      color: 'bg-blue-500',
    },
    {
      title: 'Ver Todas as Notícias',
      description: 'Gerenciar notícias existentes',
      href: '/admin/news',
      icon: Newspaper,
      color: 'bg-gray-600',
    },
    {
      title: 'Nova Tag',
      description: 'Adicionar uma nova tag',
      href: '/admin/tags/create',
      icon: Plus,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao painel de administração
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2e4b89]"></div>
          <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-transparent hover:border-l-[#2e4b89] transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#2e4b89] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
