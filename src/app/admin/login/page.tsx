'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Accès refusé');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-panel backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.32em] text-white/40">LMAJHOL / Admin</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Connexion admin</h1>
        <p className="mt-3 text-sm leading-6 text-white/58">
          Entrer le mot de passe admin pour gérer les produits visibles sur le site.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="space-y-2 text-sm text-white/65">
            <span>Mot de passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/25"
            />
          </label>

          {error ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Entrer'}
          </button>
        </form>
      </div>
    </main>
  );
}
