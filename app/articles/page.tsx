"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { getArticles, Article as APIArticle } from "@/utils/api";

interface Article extends APIArticle {
  excerpt: string;
  thumbnailUrl?: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(15);

  useEffect(() => {
    async function load() {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 15);
  };

  if (loading) return <p className="p-8">Carregando artigos…</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  const visibleArticles = articles.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow overflow-hidden">
              {article.thumbnailUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.thumbnailUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 truncate">{article.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Por {article.author.name}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
                </div>
                <Link
                  href={`/articles/${article.id}`}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Leia mais
                </Link>
              </div>
            </div>
          ))}
        </div>
        {visibleCount < articles.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Carregar mais
            </button>
          </div>
        )}
      </main>
    </div>
  );
}