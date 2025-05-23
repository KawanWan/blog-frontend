"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api, { getArticles, Article as APIArticle } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Article extends APIArticle {
  excerpt: string;
  thumbnailUrl?: string;
}

export default function ArticlesListPage() {
  const { user } = useAuth();
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

  const handleLoadMore = () => setVisibleCount((prev) => prev + 15);

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este artigo?")) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Falha ao excluir o artigo.");
    }
  };

  if (loading) return <p className="p-8">Carregando artigos…</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  const visibleArticles = articles.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
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

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2 truncate">{article.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-col text-xs text-gray-500">
                    <span>{article.author.name}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
                  </div>

                  {user?.id === article.author.id && (
                    <div className="flex space-x-2">
                      <Link
                        href={`/articles/${article.id}/edit`}
                        className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        title="Editar"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-1 bg-red-500 hover:bg-red-600 text-white rounded"
                        title="Excluir"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
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