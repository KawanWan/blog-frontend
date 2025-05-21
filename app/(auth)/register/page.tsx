'use client';
import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
    const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("As senhas não coincidem");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Erro ao registrar");

            alert("Conta criada com sucesso");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro desconhecido");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Registrar">
            <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                <FormInput label="Email" type="email" name="email" placeholder="email@email.com" onChange={handleChange} />
                <FormInput label="Senha" type="password" name="password" placeholder="****" onChange={handleChange} />
                <FormInput label="Confirmar senha" type="password" name="confirmPassword" placeholder="****" onChange={handleChange} />

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <button type="submit" className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-900 transition" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar conta"}
                </button>

                <p className="mt-4 text-center text-sm">
                    Já tem cadastro? <Link href="/login" className="text-black underline">Clique aqui</Link>
                </p>
            </form>
        </AuthLayout>
    );
}