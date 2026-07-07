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
    () => (products.filter((product) => product.featured).length ? products.filter((product) => product.featured) : products),
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
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/55 backdrop-blur-xl">
                <span>Edition 01</span>
                <span className="h-1 w-1 rounded-full bg-white/45" />
                <span>Casablanca</span>
              </div>

              <h1 className="text-balance text-[3.5rem] font-semibold uppercase leading-[0.84] tracking-[-0.05em] text-white sm:text-[4.8rem] md:text-[6.6rem] xl:text-[8rem]">
                Noir. Blanc.
                <br />
                Oversized.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/64 sm:text-lg">
                LMAJHOL construit une silhouette propre, ample et assumée. Une seule obsession : des t-shirts noirs et blancs qui tombent fort.
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
                  Explorer la collection
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.18, ease: 'easeOut' }}
              className="panel rounded-[2.2rem] p-6 shadow-glow lg:ml-auto lg:max-w-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Signature</p>
                <Sparkles className="h-4 w-4 text-white/65" />
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-4xl font-semibold leading-tight text-white">Une présence sobre, mais chère au regard.</p>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    Matière visuelle sombre, profondeur 3D, mouvement au scroll et composition éditoriale pour donner à LMAJHOL une vraie présence premium.
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-white/60 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/38">Style</p>
                    <p className="mt-2 text-white">Essential</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/38">Fit</p>
                    <p className="mt-2 text-white">Oversized</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/38">Delivery</p>
                    <p className="mt-2 text-white">Cash on delivery</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-white/8 bg-black/25 py-5">
          <div className="marquee-track flex min-w-max items-center gap-10 whitespace-nowrap px-6 text-[1.9rem] font-semibold uppercase tracking-[-0.03em] text-white/85 sm:text-[2.3rem] lg:text-[3rem]">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-center gap-10">
                <span>LMAJHOL</span>
                <span className="text-white/35">•</span>
                <span>Noir</span>
                <span className="text-white/35">•</span>
                <span>Blanc</span>
                <span className="text-white/35">•</span>
                <span>Oversized</span>
                <span className="text-white/35">•</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {[
              {
                title: 'Paiement simple',
                text: 'Commande directe avec vos coordonnées et paiement à la livraison.',
                icon: ShieldCheck
              },
              {
                title: 'Coupe oversized',
                text: 'Volumes amples, présence clean et silhouette moderne.',
                icon: Package
              },
              {
                title: 'Commande rapide',
                text: 'Choisissez votre taille et validez en quelques secondes.',
                icon: ArrowUpRight
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="panel rounded-[1.9rem] p-6"
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
            <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Collection</p>
                <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">Deux tons. Une attitude.</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/58">
                Une sélection réduite, plus forte, avec une mise en avant centrée sur la coupe, la matière et la présence visuelle.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              {featuredProducts.slice(0, 1).map((product) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.24 }}
                  transition={{ duration: 0.7 }}
                  className="panel relative overflow-hidden rounded-[2.4rem]"
                >
                  <div className="absolute right-6 top-4 text-[7rem] font-semibold leading-none tracking-[-0.08em] text-white/[0.05] sm:text-[10rem]">
                    01
                  </div>
                  <div className="grid min-h-[620px] lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="relative border-b border-white/10 bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent lg:border-b-0 lg:border-r">
                      <div className="absolute inset-0 bg-grain opacity-90" />
                      <div className="relative flex h-full items-center justify-center p-10 sm:p-14">
                        <Image src={product.image} alt={product.name} width={720} height={940} className="h-auto max-h-[520px] w-auto drop-shadow-[0_40px_120px_rgba(255,255,255,0.08)]" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between p-8 sm:p-10">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/36">{product.color}</p>
                        <h3 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">{product.name}</h3>
                        <p className="mt-5 text-2xl font-semibold text-white">{formatPrice(product.price)}</p>
                        <p className="mt-8 max-w-xl text-sm leading-7 text-white/58">{product.description}</p>
                        <p className="mt-5 text-sm leading-7 text-white/70">{product.materials}</p>
                        <div className="mt-8 flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <span key={size} className="rounded-full border border-white/14 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/65">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <button
                          onClick={() => openOrder(product)}
                          className="rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                        >
                          Commander
                        </button>
                        <button
                          onClick={() => openOrder(product)}
                          className="rounded-full border border-white/16 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
                        >
                          Choisir la taille
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}

              <div className="grid gap-8">
                {featuredProducts.slice(1).map((product, index) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.24 }}
                    transition={{ duration: 0.7, delay: index * 0.08 }}
                    className="panel relative overflow-hidden rounded-[2.2rem] p-7 sm:p-8"
                  >
                    <div className="absolute right-5 top-3 text-[5rem] font-semibold leading-none tracking-[-0.08em] text-white/[0.05]">
                      02
                    </div>
                    <div className="relative flex min-h-[520px] flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/36">{product.color}</p>
                        <h3 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{product.name}</h3>
                        <p className="mt-4 text-lg font-semibold text-white">{formatPrice(product.price)}</p>
                      </div>

                      <div className="relative my-8 flex justify-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-transparent p-8">
                        <Image src={product.image} alt={product.name} width={520} height={700} className="h-auto max-h-[340px] w-auto drop-shadow-[0_35px_100px_rgba(255,255,255,0.08)]" />
                      </div>

                      <div>
                        <p className="text-sm leading-7 text-white/58">{product.description}</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <span key={size} className="rounded-full border border-white/14 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/65">
                              {size}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => openOrder(product)}
                          className="mt-8 rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                        >
                          Commander
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              className="panel rounded-[2.4rem] p-8 sm:p-10"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">L’esprit LMAJHOL</p>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Une marque courte en mots, forte en présence.
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58">
                LMAJHOL avance avec une direction très claire : de l’espace, du noir, du blanc, de la coupe, et une sensation plus proche d’un studio mode que d’une boutique classique.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  label: '01',
                  title: 'Coupe ample',
                  text: 'Des proportions larges pour un tombé confortable et visuellement fort.'
                },
                {
                  label: '02',
                  title: 'Palette nette',
                  text: 'Blanc cassé, noir profond, contraste propre et facile à porter.'
                },
                {
                  label: '03',
                  title: 'Détails sobres',
                  text: 'Moins d’éléments, plus d’impact, avec une lecture simple et premium.'
                },
                {
                  label: '04',
                  title: 'Commande directe',
                  text: 'Choisissez votre modèle, vos infos et validez sans friction.'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6, delay: index * 0.07 }}
                  className="panel rounded-[1.8rem] p-6"
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
          <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-panel sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Commande / Maroc</p>
                <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Choisissez votre tee et passez votre commande en quelques instants.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58">
                  Sélectionnez votre couleur, votre taille, vos coordonnées, puis validez. Nous vous recontacterons pour confirmer.
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
                  href="#collection"
                  className="rounded-full border border-white/16 bg-white/5 px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
                >
                  Voir les produits
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 pb-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.28em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>LMAJHOL — Oversized essentials</p>
          <p>Noir / Blanc / Paiement à la réception</p>
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
