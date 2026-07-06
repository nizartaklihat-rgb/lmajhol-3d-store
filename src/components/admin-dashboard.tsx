'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Product } from '@/types/store';
import { formatPrice } from '@/lib/utils';

type EditableProduct = Product & { sizesText?: string };

const emptyDraft: EditableProduct = {
  id: '',
  slug: '',
  name: '',
  color: 'Noir',
  price: 0,
  currency: 'MAD',
  sizes: ['M', 'L'],
  sizesText: 'M, L',
  description: '',
  materials: '',
  image: '/products/black-oversized-tee.svg',
  featured: false,
  stockStatus: 'en_stock'
};

export function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedId, setSelectedId] = useState<string>(initialProducts[0]?.id || 'new');
  const [draft, setDraft] = useState<EditableProduct>(() => ({
    ...(initialProducts[0] || emptyDraft),
    sizesText: (initialProducts[0]?.sizes || ['M', 'L']).join(', ')
  }));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (selectedId === 'new') {
      setDraft(emptyDraft);
      return;
    }

    const product = products.find((entry) => entry.id === selectedId);
    if (product) {
      setDraft({ ...product, sizesText: product.sizes.join(', ') });
    }
  }, [selectedId, products]);

  const selectedLabel = useMemo(() => {
    if (selectedId === 'new') return 'Nouveau produit';
    return products.find((entry) => entry.id === selectedId)?.name || 'Produit';
  }, [products, selectedId]);

  async function refreshProducts() {
    const response = await fetch('/api/products');
    const data = await response.json();
    if (response.ok) setProducts(data.products || []);
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        ...draft,
        sizes: (draft.sizesText || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      };

      const isCreate = selectedId === 'new';
      const response = await fetch(isCreate ? '/api/products' : `/api/products/${selectedId}`, {
        method: isCreate ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la sauvegarde');

      await refreshProducts();
      setSelectedId(data.product?.id || selectedId);
      setMessage(isCreate ? 'Produit ajouté.' : 'Produit mis à jour.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (selectedId === 'new') return;
    const confirmed = window.confirm('Supprimer ce produit ?');
    if (!confirmed) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/products/${selectedId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Suppression impossible');

      await refreshProducts();
      setSelectedId('new');
      setMessage('Produit supprimé.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productName', draft.name || 'product');
      formData.append('productSlug', draft.slug || draft.name || 'product');

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload impossible');

      setDraft((previous) => ({ ...previous, image: data.url }));
      setMessage('Image envoyée. N’oubliez pas de sauvegarder le produit.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur image inconnue');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/40">LMAJHOL / admin privé</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Gestion des produits</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
              Ajoute, modifie ou supprime les produits visibles sur le site. Tu peux maintenant envoyer une vraie image produit directement depuis l’admin.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/16 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.32em] text-white/38">Catalogue</p>
              <button
                onClick={() => setSelectedId('new')}
                className="rounded-full border border-white/14 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/70 transition hover:border-white/25 hover:text-white"
              >
                Nouveau
              </button>
            </div>

            <div className="space-y-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedId(product.id)}
                  className={`w-full rounded-[1.35rem] border px-4 py-4 text-left transition ${selectedId === product.id ? 'border-white/24 bg-white/10' : 'border-white/10 bg-black/20 hover:border-white/16 hover:bg-white/[0.06]'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/38">{product.color}</p>
                      <p className="mt-2 text-lg font-medium text-white">{product.name}</p>
                    </div>
                    <p className="text-sm text-white/68">{formatPrice(product.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel backdrop-blur-2xl sm:p-7">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/38">Édition</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{selectedLabel}</h2>
              </div>
              {selectedId !== 'new' ? (
                <button
                  onClick={handleDelete}
                  className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-red-100 transition hover:bg-red-500/15"
                >
                  Supprimer
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/65">
                <span>Nom</span>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/24" />
              </label>
              <label className="space-y-2 text-sm text-white/65">
                <span>Slug</span>
                <input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/24" />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/65">
                <span>Couleur</span>
                <select value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/24">
                  <option className="bg-black">Blanc</option>
                  <option className="bg-black">Noir</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/65">
                <span>Prix (MAD)</span>
                <input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/24" />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/65">
                <span>Tailles (séparées par virgule)</span>
                <input value={draft.sizesText} onChange={(e) => setDraft({ ...draft, sizesText: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/24" />
              </label>
              <label className="space-y-2 text-sm text-white/65">
                <span>Image URL</span>
                <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/24" />
              </label>
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <div className="grid gap-5 lg:grid-cols-[160px_1fr] lg:items-start">
                <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5">
                  <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
                    {draft.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={draft.image} alt={draft.name || 'Prévisualisation produit'} className="h-full w-full object-cover" />
                    ) : (
                      <span className="px-4 text-center text-xs uppercase tracking-[0.28em] text-white/35">Aperçu image</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-white">Uploader une image produit</p>
                    <p className="mt-1 text-sm leading-6 text-white/52">
                      Formats acceptés: PNG, JPG, WEBP, SVG. Taille max: 5MB. L’image est envoyée dans Supabase Storage.
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-center justify-center rounded-full border border-white/16 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:border-white/28 hover:bg-white/8">
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                    {uploadingImage ? 'Upload en cours...' : 'Choisir une image'}
                  </label>

                  <p className="text-xs uppercase tracking-[0.24em] text-white/32">
                    Après l’upload, clique sur <span className="text-white/58">Enregistrer</span> pour sauvegarder le produit avec la nouvelle image.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/65">
                <span>Statut</span>
                <select value={draft.stockStatus} onChange={(e) => setDraft({ ...draft, stockStatus: e.target.value as Product['stockStatus'] })} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/24">
                  <option className="bg-black" value="en_stock">En stock</option>
                  <option className="bg-black" value="rupture">Rupture</option>
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/68">
                <input type="checkbox" checked={Boolean(draft.featured)} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
                <span>Produit mis en avant</span>
              </label>
            </div>

            <label className="mt-4 block space-y-2 text-sm text-white/65">
              <span>Description</span>
              <textarea rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/24" />
            </label>

            <label className="mt-4 block space-y-2 text-sm text-white/65">
              <span>Matières / détails</span>
              <textarea rows={3} value={draft.materials} onChange={(e) => setDraft({ ...draft, materials: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-white/24" />
            </label>

            {message ? <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</div> : null}
            {error ? <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div> : null}

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={handleSave}
                disabled={saving || uploadingImage}
                className="rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02] disabled:opacity-55"
              >
                {saving ? 'Sauvegarde...' : selectedId === 'new' ? 'Ajouter le produit' : 'Enregistrer'}
              </button>
              <button
                onClick={() => setSelectedId('new')}
                className="rounded-full border border-white/16 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
              >
                Nouveau brouillon
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
