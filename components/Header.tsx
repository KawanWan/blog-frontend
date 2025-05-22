"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="w-full flex items-center justify-between py-4 px-8 bg-white shadow-sm">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.svg"
          alt="Logo do Blog"
          width={66}
          height={46}
          priority
        />
      </Link>

      <nav className="flex items-center space-x-6">
        <Link href="/" className="text-gray-700 hover:text-black">
          Home
        </Link>
        <Link href="/articles" className="text-gray-700 hover:text-black">
          Artigos
        </Link>

        <span className="text-gray-400">|</span>

        {isAuthenticated ? (
          <>
            <Link href="/publish" className="text-gray-700 hover:text-black">
              Publicar
            </Link>

            <div className="flex items-center space-x-4">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Avatar de usuário"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">👤</span>
                </div>
              )}

              <button onClick={logout} className="text-gray-700 hover:text-black">
                Sair
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 hover:text-black">
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Registrar
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}