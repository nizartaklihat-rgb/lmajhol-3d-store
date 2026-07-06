'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Package, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '@/types/store';
import { formatPrice } from '@/lib/utils';
import { HeroScene } from '@/components/hero-scene';
import { Navbar } from '@/components/navbar';
import { OrderModal } from '@/components/order-modal';

export function Storefront({ products }: { products: Product[] }) {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured).length ? products.filter((product) => product.featured) : products,
    [products]
  );

  function openOrder(product?: Product) {
    setSelectedProduct(product || products[0] || null);
    setIsOrderOpen(true);
  }

  return (
    <>
      <HeroScene />
      <Navbar onOrderClick={() => openOrder()} />

      <main className="relative overflow-x-hidden">
        <section id="experience" className="relative flex min-h-screen items-end px-6 pb-16 pt-36 lg:px-10 lg:pb-24">
          <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="max-w-3xl"
            >
              <p className="mb-5 text-xs uppercase tracking-[0.36em] text-white/45">Casablanca / monochrome oversized identity</p>
              <h1 className="text-balance text-[3.4rem] font-semibold uppercase leading-[0.88] tracking-[-0.04em] text-white sm:text-[4.7rem] md:text-[6.4rem] xl:text-[7.6rem]">
                LMAJHOL
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/66 sm:text-lg">
                Blanc. Noir. Coupe ample. Une expérience 3D pensée comme une entrée de défilé pour vendre vos essentiels oversized avec paiement à la livraison au Maroc.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => openOrder(products[0])}
                  className="rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                >
                  Commander maintenant
                </button>
                <a
                  href="#collection"
                  className="rounded-full border border-white/16 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
                >
                  Voir la collection
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.18, ease: 'easeOut' }}
              className="panel rounded-[2rem] p-6 shadow-glow lg:ml-auto lg:max-w-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Opening scene</p>
                <Sparkles className="h-4 w-4 text-white/65" />
              </div>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-4xl font-semibold text-white">Scroll = mouvement</p>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    Les pièces flottent, la caméra avance et l’univers change au scroll pour donner un sentiment de marque plus premium qu’un simple catalogue.
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-white/60 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/38">Mood</p>
                    <p className="mt-2 text-white">Runway</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/38">Palette</p>
                    <p className="mt-2 text-white">Noir / Blanc</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/38">Flow</p>
                    <p className="mt-2 text-white">COD + Telegram</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {[
              {
                title: 'Paiement simple',
                text: 'Commande directe avec formulaire clair, pensé pour le cash à la livraison.',
                icon: ShieldCheck
              },
              {
                title: 'Alerte Telegram',
                text: 'Chaque commande arrive dans votre bot Telegram avec les détails client.',
                icon: ArrowUpRight
              },
              {
                title: 'Admin privé',
                text: 'Tableau de bord admin pour gérer les produits plus tard sans toucher au design.',
                icon: Package
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="panel rounded-[1.75rem] p-6"
              >
                <item.icon className="h-5 w-5 text-white/72" />
                <h3 className="mt-5 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="collection" className="px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Collection</p>
                <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">L’essentiel oversized, sans bruit.</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/58">
                Démarre avec deux pièces fortes — blanc et noir — puis ajoute les prochains produits depuis l’admin. Le design reste premium même si tu fais évoluer le catalogue.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {featuredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.24 }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                  className="panel overflow-hidden rounded-[2rem]"
                >
                  <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative min-h-[420px] border-b border-white/10 bg-gradient-to-br from-white/9 via-white/[0.03] to-transparent lg:border-b-0 lg:border-r">
                      <div className="absolute inset-0 bg-grain opacity-90" />
                      <div className="relative flex h-full items-center justify-center p-10">
                        <Image src={product.image} alt={product.name} width={540} height={720} className="h-auto max-h-[420px] w-auto drop-shadow-[0_30px_80px_rgba(255,255,255,0.08)]" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between p-7 sm:p-8">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/38">{product.color}</p>
                            <h3 className="mt-3 text-3xl font-semibold text-white">{product.name}</h3>
                          </div>
                          <p className="text-lg font-semibold text-white">{formatPrice(product.price)}</p>
                        </div>
                        <p className="mt-5 text-sm leading-7 text-white/58">{product.description}</p>
                        <p className="mt-5 text-sm text-white/70">{product.materials}</p>
                        <div className="mt-7 flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <span key={size} className="rounded-full border border-white/14 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/65">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <button
                          onClick={() => openOrder(product)}
                          className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                        >
                          Commander
                        </button>
                        <button
                          onClick={() => openOrder(product)}
                          className="rounded-full border border-white/16 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
                        >
                          Choisir la taille
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="story" className="px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              className="panel rounded-[2rem] p-8"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">Direction</p>
              <h2 className="mt-5 text-4xl font-semibold text-white">Une marque petite, mais une présence grande.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/58">
                Le site prend une direction galerie / fashion-show : peu d’éléments, plus de matière, du mouvement contrôlé, une narration visuelle concentrée sur la coupe, le contraste et la présence du vêtement.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  label: '01',
                  title: 'Hero 3D cinématique',
                  text: 'Les t-shirts sculptés flottent dans un espace noir, la caméra avance au scroll et renforce l’effet premium.'
                },
                {
                  label: '02',
                  title: 'Formulaire orienté conversion',
                  text: 'Pas de tunnel compliqué : sélection, infos client, confirmation, puis envoi Telegram.'
                },
                {
                  label: '03',
                  title: 'Admin sécurisé',
                  text: 'Accès protégé par mot de passe avec CRUD produit prêt pour Supabase.'
                },
                {
                  label: '04',
                  title: 'Évolutif',
                  text: 'Tu peux changer les visuels, les prix, les tailles et ajouter de nouvelles références plus tard.'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6, delay: index * 0.07 }}
                  className="panel rounded-[1.75rem] p-6"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/36">{item.label}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/58">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="order" className="px-6 pb-20 pt-24 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-8 shadow-panel sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Commande / Maroc</p>
                <h2 className="mt-5 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
                  Active la vente maintenant, puis fais évoluer les produits plus tard.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58">
                  Le site est prêt pour une première version forte. Tu peux démarrer avec les deux t-shirts, recevoir les commandes sur Telegram, puis brancher Supabase pour gérer tout ton catalogue en admin privé.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => openOrder(products[0])}
                  className="rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                >
                  Ouvrir le formulaire
                </button>
                <a
                  href="/admin/login"
                  className="rounded-full border border-white/16 bg-white/5 px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
                >
                  Accès admin
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 pb-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.28em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>LMAJHOL — Oversized essentials</p>
          <p>Cash à la livraison / admin privé / Telegram ready</p>
        </div>
      </footer>

      <OrderModal
        open={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        products={products}
        selectedProduct={selectedProduct}
      />
    </>
  );
}
