import { FeaturedList, Article } from '@/components/FeaturedList';
import Image from 'next/image';
import Link from 'next/link';

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL =
  process.env.NODE_ENV === 'development'
    ? RAW_API_URL.replace(/^https?:\/\//, 'http://')
    : RAW_API_URL;

export default async function HomePage() {
  let articles: Article[] = [];
  try {
    const base = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;
    const res = await fetch(`${base}/articles?sort=publishedAt:desc`, { cache: 'no-store' });
    if (res.ok) articles = await res.json();
  } catch (err) {
    console.error('Error fetching articles:', err);
  }

  const hero = articles[0];
  const links = articles.slice(1, 6);

  return (
    <>
      <main className="px-8 py-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hero à esquerda */}
          <div className="md:col-span-2 space-y-4">
            {hero && (
              <>
                <div className="relative w-full h-80 rounded overflow-hidden">
                  {hero.thumbnailUrl ? (
                    <Image
                      src={hero.thumbnailUrl}
                      alt={hero.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded" />
                  )}
                </div>
                <h1 className="text-3xl font-bold leading-tight">{hero.title}</h1>
                {/* Removido o excerpt */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-sm text-gray-500 space-x-2">
                    <span>Por {hero.author.name} - </span>
                    <span>
                      {new Date(hero.publishedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <Link href={`/articles/${hero.id}`}>  
                    <button className="px-5 py-2 bg-red-500 text-white rounded-lg">
                      Ler Mais
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Lista de links à direita */}
          <aside className="bg-black text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">New</h2>
            <ul className="space-y-3">
              {links.map((art) => (
                <li key={art.id}>
                  <Link href={`/articles/${art.id}`} className="hover:underline">
                    {art.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <FeaturedList articles={articles.slice(1, 4)} />
      </main>
    </>
  );
}
