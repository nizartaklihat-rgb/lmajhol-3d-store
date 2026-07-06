'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/store';
import { formatPrice } from '@/lib/utils';

const defaultProduct = (product?: Product) => ({
  fullName: '',
  phone: '',
  city: '',
  address: '',
  productId: product?.id || '',
  productName: product?.name || '',
  size: product?.sizes?.[0] || 'M',
  quantity: 1,
  color: product?.color || 'Blanc',
  note: ''
});

export function OrderModal({
  open,
  onClose,
  products,
  selectedProduct
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
  selectedProduct?: Product | null;
}) {
  const [form, setForm] = useState(defaultProduct(selectedProduct || undefined));
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(defaultProduct(selectedProduct || products[0]));
    setStatus('idle');
    setMessage('');
  }, [open, selectedProduct, products]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const currentProduct = products.find((product) => product.id === form.productId) || selectedProduct || products[0];

  useEffect(() => {
    if (!currentProduct) return;
    setForm((previous) => ({
      ...previous,
      productId: currentProduct.id,
      productName: currentProduct.name,
      color: currentProduct.color,
      size: currentProduct.sizes.includes(previous.size) ? previous.size : currentProduct.sizes[0]
    }));
  }, [currentProduct?.id]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de l\'envoi');

      setStatus('success');
      setMessage('Commande envoyée. Vous la recevrez aussi sur Telegram.');
      setForm(defaultProduct(currentProduct));
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] shadow-panel lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden border-r border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-10 lg:block">
          <div className="absolute inset-0 bg-grain opacity-90" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">LMAJHOL / CASH À LA LIVRAISON</p>
              <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight text-white">
                Finalise la commande et reçois la confirmation directement.
              </h2>
            </div>

            {currentProduct ? (
              <div className="rounded-[1.75rem] border border-white/12 bg-black/35 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Produit sélectionné</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{currentProduct.name}</h3>
                    <p className="mt-2 text-sm text-white/60">{currentProduct.description}</p>
                  </div>
                  <p className="text-lg font-semibold text-white">{formatPrice(currentProduct.price)}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {currentProduct.sizes.map((size) => (
                    <span key={size} className="rounded-full border border-white/14 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/65">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Commander</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Paiement à la livraison</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70 transition hover:border-white/25 hover:text-white"
            >
              Fermer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/68">
                <span>Nom complet</span>
                <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30" />
              </label>
              <label className="space-y-2 text-sm text-white/68">
                <span>Téléphone</span>
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/68">
                <span>Ville</span>
                <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30" />
              </label>
              <label className="space-y-2 text-sm text-white/68">
                <span>Adresse</span>
                <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/68">
                <span>Produit</span>
                <select
                  value={form.productId}
                  onChange={(e) => {
                    const product = products.find((entry) => entry.id === e.target.value);
                    if (!product) return;
                    setForm({
                      ...form,
                      productId: product.id,
                      productName: product.name,
                      color: product.color,
                      size: product.sizes[0]
                    });
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id} className="bg-black">
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-white/68">
                <span>Taille</span>
                <select
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
                >
                  {(currentProduct?.sizes || ['M']).map((size) => (
                    <option key={size} value={size} className="bg-black">
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/68">
                <span>Quantité</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
                />
              </label>
              <label className="space-y-2 text-sm text-white/68">
                <span>Couleur</span>
                <input value={form.color} readOnly className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/72 outline-none" />
              </label>
            </div>

            <label className="space-y-2 text-sm text-white/68">
              <span>Note</span>
              <textarea
                rows={4}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
                placeholder="Exemple : appeler avant livraison"
              />
            </label>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/58">
              Paiement à la livraison. Remplissez vos informations et nous vous contacterons pour confirmer la commande.
            </div>

            {message ? (
              <div className={`rounded-2xl p-4 text-sm ${status === 'success' ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border border-red-500/30 bg-red-500/10 text-red-200'}`}>
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.01] disabled:opacity-50"
            >
              {status === 'loading' ? 'Envoi...' : 'Envoyer la commande'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
