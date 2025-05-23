"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/articles/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) throw new Error("Não encontrado");
        const data = (await res.json()) as {
          title: string;
          content: string;
          thumbnailUrl?: string;
          image?: string;
        };
        setTitle(data.title);
        setContent(data.content);
        const src = data.thumbnailUrl || data.image || null;
        if (src) setPreview(src);
      } catch {
        setError("Erro ao carregar artigo.");
      }
    }
    load();
  }, [API_URL, id, token]);

  // Troca de arquivo e preview local
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("image", file);

    try {
      const res = await fetch(`${API_URL}/articles/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      router.push(`/articles/${id}`);
    } catch {
      setError("Erro ao salvar artigo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-10 py-8">
        <h1 className="text-2xl font-semibold mb-6">Editar Artigo</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div className="flex items-start space-x-8 w-full">
            <div className="flex-1">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Imagem destacada (opcional)
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block"
              />
            </div>
            {preview && (
              <div className="w-64 h-40 relative rounded overflow-hidden ml-auto">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  sizes="256px"
                  loader={({ src }) => src}
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Texto
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}