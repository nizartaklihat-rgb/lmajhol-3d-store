'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Package, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '@/types/store';
import { formatPrice } from '@/lib/utils';
import { HeroScene } from '@/components/hero-scene';
import { Navbar } from '@/components/navbar';
import { OrderModal } from '@/components/order-modal';

export function Storefront({ products }: { products: Product[] }) {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const variants = useMemo(() => {
    const source = products.filter((product) => product.featured).length
      ? products.filter((product) => product.featured)
      : products;

    return [...source].sort((a, b) => {
      if (a.color.toLowerCase().includes('blanc')) return -1;
      if (b.color.toLowerCase().includes('blanc')) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [products]);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id || '');
  const selectedVariant = variants.find((product) => product.id === selectedVariantId) || variants[0] || null;

  useEffect(() => {
    if (!selectedVariantId && variants[0]) {
      setSelectedVariantId(variants[0].id);
      return;
    }

    if (selectedVariantId && !variants.find((product) => product.id === selectedVariantId) && variants[0]) {
      setSelectedVariantId(variants[0].id);
    }
  }, [selectedVariantId, variants]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    variants.forEach((product) => product.sizes.forEach((size) => set.add(size)));
    return [...set];
  }, [variants]);

  function openOrder(product?: Product) {
    if (product) {
      setSelectedVariantId(product.id);
    }
    setIsOrderOpen(true);
  }

  return (
    <>
      <HeroScene />
      <Navbar onOrderClick={() => openOrder(selectedVariant || variants[0] || undefined)} />

      <main className="relative overflow-x-hidden">
        <section id="experience" className="relative flex min-h-screen items-center justify-center px-6 pb-12 pt-28 lg:px-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/55 backdrop-blur-xl"
            >
              <span>Casablanca</span>
              <span className="h-1 w-1 rounded-full bg-white/45" />
              <span>Premium essentials</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.08, ease: 'easeOut' }}
              className="mt-8 text-center text-[4.2rem] font-semibold uppercase leading-[0.82] tracking-[-0.08em] text-white sm:text-[5.8rem] md:text-[7.6rem] xl:text-[10rem]"
            >
              LMAJHOL
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.16, ease: 'easeOut' }}
              className="mt-7 max-w-2xl text-base leading-7 text-white/62 sm:text-lg"
            >
              Une silhouette oversized pensée en noir et blanc. Une présence simple, propre et forte, portée par une expérience 3D plus proche d’un studio mode que d’une boutique classique.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.24, ease: 'easeOut' }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <button
                onClick={() => openOrder(selectedVariant || variants[0] || undefined)}
                className="rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
              >
                Commander maintenant
              </button>
              <a
                href="#collection"
                className="rounded-full border border-white/16 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
              >
                Découvrir le produit
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.34, ease: 'easeOut' }}
              className="mt-14 grid w-full max-w-4xl gap-4 sm:grid-cols-3"
            >
              {[
                ['Palette', 'Noir / Blanc'],
                ['Produit', 'Oversized Tee'],
                ['Paiement', 'À la livraison']
              ].map(([label, value]) => (
                <div key={label} className="panel rounded-[1.6rem] px-5 py-5 text-left">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/38">{label}</p>
                  <p className="mt-3 text-lg font-medium text-white">{value}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-white/8 bg-black/25 py-5">
          <div className="marquee-track flex min-w-max items-center gap-10 whitespace-nowrap px-6 text-[1.9rem] font-semibold uppercase tracking-[-0.03em] text-white/85 sm:text-[2.3rem] lg:text-[3rem]">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-center gap-10">
                <span>LMAJHOL</span>
                <span className="text-white/35">•</span>
                <span>Oversized Tee</span>
                <span className="text-white/35">•</span>
                <span>Noir</span>
                <span className="text-white/35">•</span>
                <span>Blanc</span>
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
                text: 'Volumes amples, tombé propre, silhouette moderne et forte.',
                icon: Package
              },
              {
                title: 'Commande rapide',
                text: 'Choisissez votre couleur, votre taille et validez en quelques secondes.',
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
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Produit</p>
                <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">Oversized Tee</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/58">
                Un seul produit. Deux versions. Blanc pour la netteté. Noir pour la profondeur. Même coupe, même attitude.
              </p>
            </div>

            {selectedVariant ? (
              <motion.article
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className="panel relative overflow-hidden rounded-[2.6rem]"
              >
                <div className="absolute right-6 top-4 text-[7rem] font-semibold leading-none tracking-[-0.08em] text-white/[0.05] sm:text-[10rem]">
                  01
                </div>

                <div className="grid min-h-[680px] lg:grid-cols-[1fr_0.92fr]">
                  <div className="relative border-b border-white/10 bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent lg:border-b-0 lg:border-r">
                    <div className="absolute inset-0 bg-grain opacity-90" />
                    <div className="relative flex h-full items-center justify-center p-8 sm:p-12 lg:p-16">
                      <Image
                        src={selectedVariant.image}
                        alt={selectedVariant.name}
                        width={880}
                        height={1100}
                        className="h-auto max-h-[560px] w-auto drop-shadow-[0_45px_120px_rgba(255,255,255,0.09)]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/36">LMAJHOL / Essential</p>
                          <h3 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{selectedVariant.name}</h3>
                        </div>
                        <p className="text-2xl font-semibold text-white">{formatPrice(selectedVariant.price)}</p>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        {variants.map((variant) => {
                          const active = variant.id === selectedVariant.id;
                          return (
                            <button
                              key={variant.id}
                              onClick={() => setSelectedVariantId(variant.id)}
                              className={`rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] transition ${active ? 'border-white bg-white text-black' : 'border-white/14 bg-white/5 text-white hover:border-white/28 hover:bg-white/8'}`}
                            >
                              {variant.color}
                            </button>
                          );
                        })}
                      </div>

                      <p className="mt-8 max-w-xl text-sm leading-7 text-white/58">{selectedVariant.description}</p>
                      <p className="mt-5 max-w-xl text-sm leading-7 text-white/68">{selectedVariant.materials}</p>

                      <div className="mt-8 flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                          <span key={size} className="rounded-full border border-white/14 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/65">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                      <button
                        onClick={() => openOrder(selectedVariant)}
                        className="rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                      >
                        Commander
                      </button>
                      <a
                        href="#order"
                        className="rounded-full border border-white/16 bg-white/5 px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
                      >
                        Livraison & commande
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ) : null}
          </div>
        </section>

        <section id="story" className="px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              className="panel rounded-[2.4rem] p-8 sm:p-10"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">L’esprit LMAJHOL</p>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Une identité courte en mots, forte en silhouette.
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58">
                LMAJHOL prend de l’espace sans parler trop fort : noir profond, blanc net, matière visuelle dense et coupe ample pour laisser la présence du vêtement dominer.
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
                  text: 'Peu d’éléments, plus d’impact, avec une lecture simple et premium.'
                },
                {
                  label: '04',
                  title: 'Commande directe',
                  text: 'Choisissez votre version, votre taille et validez sans friction.'
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
                  Choisissez votre version et passez votre commande en quelques instants.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58">
                  Sélectionnez blanc ou noir, choisissez votre taille, laissez vos coordonnées puis validez. Nous vous recontacterons pour confirmer.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => openOrder(selectedVariant || variants[0] || undefined)}
                  className="rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:scale-[1.02]"
                >
                  Ouvrir le formulaire
                </button>
                <a
                  href="#collection"
                  className="rounded-full border border-white/16 bg-white/5 px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/28 hover:bg-white/8"
                >
                  Revoir le produit
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 pb-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.28em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>LMAJHOL — Oversized essentials</p>
          <p>One tee / Two versions / Cash on delivery</p>
        </div>
      </footer>

      <OrderModal
        open={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        products={variants}
        selectedProduct={selectedVariant}
      />
    </>
  );
}
