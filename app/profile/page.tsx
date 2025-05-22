'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    user?.avatar ? `data:image/jpeg;base64,${user.avatar}` : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (avatarFile) formData.append('avatar', avatarFile);

      await api.patch('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseErr = (err as { response?: { data?: { error?: string } } })
          .response;
        setError(responseErr?.data?.error || 'Erro ao atualizar perfil');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto py-12 grid grid-cols-2 gap-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-3xl font-bold">Editar Perfil</h1>

        {/* Campo de nome */}
        <div>
          <label className="block mb-2 font-medium">Nome</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Upload de avatar */}
        <div>
          <label className="block mb-2 font-medium">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="border p-2 rounded"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-900 transition"
          >
            {loading ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>

      <div className="flex flex-col items-center">
        {preview && (
          <div className="relative w-64 h-64 overflow-hidden rounded-lg">
            <Image
              src={preview}
              alt="Preview do avatar"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}