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
  const rawId = params.id;

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rawId || Array.isArray(rawId)) {
      setError("ID de artigo inválido");
      setLoading(false);
      return;
    }
    const id = rawId;

    async function loadArticle() {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [rawId]);

  if (loading) return <p className="p-8">Carregando artigo…</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!article) return <p className="p-8">Artigo não encontrado.</p>;

  // Usa thumbnailUrl ou image caso um deles exista
  const imgSrc = article.thumbnailUrl ?? article.image;

  return (
    <div className="min-h-screen bg-gray-100">
      <article className="container mx-auto px-6 py-12 prose lg:prose-xl text-center">
        <h1 className="text-5xl font-extrabold leading-tight mb-4">{article.title}</h1>
        <p className="text-gray-500 text-sm mb-8">
          Por {article.author.name} &bull; {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
        </p>

        {imgSrc && (
          <div className="relative w-full h-96 mx-auto mb-8 max-w-4xl">
            <Image
              src={imgSrc}
              alt={article.title}
              fill
              sizes="100vw"
              loader={({ src }) => src}
              unoptimized
              className="object-cover rounded"
            />
          </div>
        )}

        <div className="mx-auto max-w-4xl text-left" dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </div>
  );
}
