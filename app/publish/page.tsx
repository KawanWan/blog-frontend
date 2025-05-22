"use client";

import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FormInput from '@/components/FormInput';
import api from '@/utils/api';

export default function PublishArticlePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Título e conteúdo são obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      if (imageFile) formData.append('thumbnail', imageFile);

      await api.post('/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      router.push('/articles');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseErr = (err as { response?: { data?: { error?: string } } }).response;
        setError(responseErr?.data?.error || 'Erro ao publicar artigo');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Publicar Novo Artigo</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Título"
            type="text"
            name="title"
            placeholder="Adicione um título"
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="block font-medium mb-1">Inserir imagem</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block"
            />
            {previewUrl && (
              <div className="mt-2">
                <img src={previewUrl} alt="Preview" className="h-40 rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Texto</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-60 border rounded px-3 py-2"
              placeholder="Escreva seu artigo"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}