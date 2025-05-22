import Image from 'next/image';
import Link from 'next/link';

export type Article = {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  publishedAt: string;
  image?: string | null;
  thumbnailUrl?: string | null;
};

interface FeaturedListProps {
  articles: Article[];
}

export function FeaturedList({ articles }: FeaturedListProps) {
  const topThree = articles.slice(0, 3);
  return (
    <section className="px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {topThree.map((item) => (
          <article key={item.id} className="space-y-2">
            <div className="relative w-full h-80 rounded overflow-hidden">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <h3 className="text-lg font-semibold leading-snug">
              <Link href={`/articles/${item.id}`} className="hover:underline block">
                {item.title}
              </Link>
            </h3>
            <div className="text-sm text-gray-500">
              {new Date(item.publishedAt).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
              })} • Por {item.author.name}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}