'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Newspaper,
  Tag,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/button';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, pathname, router]);

  // Don't render layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#2e4b89] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Notícias',
      href: '/admin/news',
      icon: Newspaper,
    },
    {
      name: 'Tags',
      href: '/admin/tags',
      icon: Tag,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col bg-[#2e4b89] text-white lg:flex">
        <div className="flex h-16 items-center justify-center border-b border-white/10">
          <h1 className="text-xl font-bold">SINDIPROSAN-ABC</h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-lg bg-white/10 px-4 py-3">
            <p className="text-sm font-medium">{session?.user?.name || 'Admin'}</p>
            <p className="text-xs text-white/70">{session?.user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 h-full w-64 bg-[#2e4b89] text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <h1 className="text-xl font-bold">SINDIPROSAN-ABC</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1 hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-white/20 font-semibold'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
              <div className="mb-3 rounded-lg bg-white/10 px-4 py-3">
                <p className="text-sm font-medium">{session?.user?.name || 'Admin'}</p>
                <p className="text-xs text-white/70">{session?.user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-800">
              {pathname === '/admin/dashboard' && 'Dashboard'}
              {pathname === '/admin/news' && 'Gerenciar Notícias'}
              {pathname === '/admin/news/create' && 'Nova Notícia'}
              {pathname?.includes('/admin/news/') && pathname?.includes('/edit') && 'Editar Notícia'}
              {pathname === '/admin/tags' && 'Gerenciar Tags'}
              {pathname === '/admin/tags/create' && 'Nova Tag'}
              {pathname?.includes('/admin/tags/') && pathname?.includes('/edit') && 'Editar Tag'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-700">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500">{session?.user?.email}</p>
            </div>
            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#2e4b89] text-white sm:flex">
              <span className="text-sm font-semibold">
                {session?.user?.name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
