import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/feature/MainLayout';
import { fetchProducts, transformProduct } from '@/lib/api';
import type { Product } from '@/types';
import { Reveal, ScaleReveal, SectionHeader, PageHeader } from '@/components/feature/EditorialReveal';
import { useScrollRestore } from '@/hooks/useScrollRestoration';
import JsonLd from '@/components/feature/JsonLd';

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://settelhetta.com';

export default function GalleryPage() {
  useScrollRestore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { products: dbProducts, media } = await fetchProducts();
        setProducts(dbProducts.map((p, i) => transformProduct(p, media[p.id] || [], i)));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const galleryItems = products.flatMap((p) =>
    p.media.map((m) => ({
      id: m.id,
      url: m.url,
      productName: p.name,
      productSlug: p.slug,
    }))
  );

  return (
    <MainLayout>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/gallery#gallery`,
        'name': 'معرض الصور | ست الحتة',
        'description': 'شاهد أجمل لحظات إكسسوارات ست الحتة — أساور، خلاخيل، سلاسل، وأطقم مطلية بالذهب في أبهى صورها. معرض صور فاخر من خان الخليلي.',
        'url': `${siteUrl}/gallery`,
        'isPartOf': {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
        },
        'about': {
          '@type': 'JewelryStore',
          '@id': `${siteUrl}/#store`,
        },
      }} />

      {/* ══════════════════ PAGE HEADER ══════════════════ */}
      <PageHeader
        label="Visual Stories"
        title="Gallery"
        description="Our accessories in their finest moments"
        bgImage="https://readdy.ai/api/search-image?query=Elegant%20flat%20lay%20arrangement%20of%20gold%20jewelry%20anklets%20bracelets%20and%20necklaces%20on%20cream%20linen%20fabric%20with%20scattered%20jasmine%20flowers%20and%20rose%20petals%2C%20warm%20Mediterranean%20sunlight%2C%20luxurious%20editorial%20product%20photography%2C%20soft%20golden%20highlights%2C%20serene%20minimal%20composition&width=1600&height=600&seq=gallery-hero&orientation=landscape"
      />

      {/* ══════════════════ GALLERY GRID ══════════════════ */}
      <section className="bg-cream-50 py-12 md:py-16">
        <div className="section-padding">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`${
                    i % 7 === 0 || i % 7 === 4
                      ? 'col-span-2 row-span-2 aspect-square'
                      : 'aspect-square'
                  } rounded-xl bg-cream-100 animate-pulse`}
                />
              ))}
            </div>
          ) : error ? (
            <Reveal delay={0} dir="up" distance={30}>
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-cream-100">
                  <i className="ri-error-warning-line text-2xl text-espresso-400"></i>
                </div>
                <p className="font-body text-sm text-espresso-500 mb-3">Failed to load gallery</p>
                <button onClick={() => window.location.reload()} className="btn-outline text-sm">
                  Retry
                </button>
              </div>
            </Reveal>
          ) : galleryItems.length === 0 ? (
            <Reveal delay={0} dir="up" distance={30}>
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-cream-100">
                  <i className="ri-image-line text-2xl text-espresso-400"></i>
                </div>
                <p className="font-body text-sm text-espresso-500">No images available yet</p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {galleryItems.map((item, index) => (
                <ScaleReveal key={item.id} delay={0.03 * index}>
                  <Link
                    to={`/products/${item.productSlug}`}
                    className={`relative rounded-xl overflow-hidden group cursor-pointer block ${
                      index % 7 === 0 || index % 7 === 4
                        ? 'col-span-2 row-span-2 aspect-square'
                        : 'aspect-square'
                    }`}
                  >
                    <motion.img
                      src={item.url}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-espresso-900/0 group-hover:bg-espresso-900/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full">
                        <p className="font-heading font-semibold text-sm text-white line-clamp-1 mb-1">
                          {item.productName}
                        </p>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-body">
                          <i className="ri-eye-line text-xs" />View Product
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScaleReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="bg-white py-16 md:py-20">
        <div className="section-padding text-center">
          <SectionHeader
            label="Browse the Collection"
            title="Find Your Perfect Piece"
            description="Every piece you see here is available in our online store — discover the full collection."
          />
          <Reveal delay={0.4} dir="up" distance={20}>
            <Link to="/products" className="btn-primary px-10 py-4">
              Shop All Products
            </Link>
          </Reveal>
        </div>
      </section>
    </MainLayout>
  );
}