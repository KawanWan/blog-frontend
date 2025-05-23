"use client";

import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();

  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pw !== confirmPw) {
      setError("As senhas não conferem.");
      return;
    }
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: pw }),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Falha ao redefinir senha");
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro inesperado";
      setError(msg);
    }
  }

  return (
    <AuthLayout title="Redefinir Senha">
      {success ? (
        <p className="text-center">
          Senha atualizada! Você será redirecionado para a tela de login.
        </p>
      ) : (
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <FormInput
            label="Nova senha"
            type="password"
            name="password"
            placeholder="••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <FormInput
            label="Confirmar nova senha"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-900 transition"
          >
            Atualizar senha
          </button>
          <p className="mt-4 text-center text-sm">
            Precisa de ajuda?{" "}
            <a href="/forgot-password" className="underline text-black">
              Reenviar link
            </a>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}