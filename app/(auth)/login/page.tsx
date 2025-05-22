'use client';

import { useAuth } from '@/context/AuthContext';
import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseErr = (err as { response?: { data?: { error?: string } } }).response;
        const message = responseErr?.data?.error || 'Credenciais inválidas';
        setError(message);
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
    <AuthLayout title="Conectar">
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <FormInput label="Email" type="email" name="email" placeholder="email@email.com" onChange={handleChange} />
        <FormInput label="Senha" type="password" name="password" placeholder="****" onChange={handleChange} />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button type="submit" className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-900 transition" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-4 text-center text-sm">
          Novo usuário? <Link href="/register" className="text-black underline">Clique aqui</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
