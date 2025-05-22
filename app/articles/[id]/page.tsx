"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getArticleById } from "@/utils/api";

interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  thumbnailUrl?: string;
  image?: string;
  author: { id: string; name: string };
  publishedAt: string;
  updatedAt: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const idParam = params.id;

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idParam || Array.isArray(idParam)) {
      setError("ID de artigo inválido");
      setLoading(false);
      return;
    }
    const validId = idParam;

    async function loadArticle() {
      try {
        const data = await getArticleById(validId);
        setArticle(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [idParam]);

  if (loading) return <p className="p-8">Carregando artigo…</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!article) return <p className="p-8">Artigo não encontrado.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <article className="container mx-auto px-20 py-12 prose lg:prose-xl">
        <h1 className="text-5xl font-extrabold leading-tight mb-6">{article.title}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-8">
          <span className="mr-4">Por {article.author.name}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
        </div>
        {article.thumbnailUrl && (
          <div className="relative w-full h-96 mb-8">
            <Image
              src={article.thumbnailUrl}
              alt={article.title}
              fill
              className="object-cover rounded"
              priority
            />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </div>
  );
}
