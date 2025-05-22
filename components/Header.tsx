import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between py-4 px-8 bg-white shadow-sm">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.svg"
          alt="Logo do Blog"
          width={66}
          height={46}
          className="block"
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
        <Link href="/login" className="text-gray-700 hover:text-black">
          Entrar
        </Link>
        <Link
          href="/register"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Registrar
        </Link>
      </nav>
    </header>
);
}