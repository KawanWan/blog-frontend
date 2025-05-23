'use client';

import AuthLayout from '@/components/AuthLayout';
import FormInput from '@/components/FormInput';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Falha ao enviar link');
      }
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    }
  }

  return (
    <AuthLayout title="Esqueci a senha">
      {sent ? (
        <p className="text-center">
          Se esse e-mail estiver cadastrado, você receberá um link para
          redefinir sua senha.
        </p>
      ) : (
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <FormInput
            label="E-mail"
            type="email"
            name="email"
            placeholder="seu@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-900 transition"
          >
            Enviar link de recuperação
          </button>

          <p className="mt-4 text-center text-sm">
            Lembrou sua senha?{' '}
            <a href="/login" className="underline text-black">
              Entrar
            </a>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
