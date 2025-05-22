'use client';

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Estado do dropdown
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Não renderiza em /login ou /register
  if (pathname === "/login" || pathname === "/register") return null;

  // Se for Base64 puro, transforma em data URI
  const avatarSrc = user?.avatar
    ? `data:image/jpeg;base64,${user.avatar}`
    : null;

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

            {/* Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(o => !o)}
                className="focus:outline-none"
              >
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt="Avatar de usuário"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">👤</span>
                  </div>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Desconectar
                  </button>
                </div>
              )}
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
