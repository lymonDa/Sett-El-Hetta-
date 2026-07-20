import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { fetchProductBySlug, fetchProducts, transformProduct, transformCategory, fetchCategories } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import type { Product, Category } from '@/types';
import MainLayout from '@/components/feature/MainLayout';
import ProductCard from '@/components/feature/ProductCard';
import ProductDetailSkeleton from '@/components/feature/ProductDetailSkeleton';
import { Reveal, SpringReveal, ScaleReveal, SectionHeader, LineDraw } from '@/components/feature/EditorialReveal';
import ProductLightbox from '@/components/feature/ProductLightbox';
import JsonLd from '@/components/feature/JsonLd';

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://settelhetta.com';

function getStockBadge(stockQty: number) {
  if (stockQty === 0) {
    return <span className="px-2.5 py-1 rounded-full bg-espresso-100 text-espresso-600 text-xs font-heading font-semibold">Out of Stock</span>;
  }
  if (stockQty <= 5) {
    return <span className="px-2.5 py-1 rounded-full bg-gold-100 text-gold-700 text-xs font-heading font-semibold">Limited Stock</span>;
  }
  return <span className="px-2.5 py-1 rounded-full bg-cream-100 text-espresso-600 text-xs font-heading font-semibold">In Stock</span>;
}

const faqItems = (t: (k: string) => string, productName: string) => [
  {
    question: t('product.faq.materialsQ'),
    answer: t('product.faq.materialsA'),
  },
  {
    question: t('product.faq.careQ'),
    answer: t('product.faq.careA'),
  },
  {
    question: t('product.faq.customQ'),
    answer: t('product.faq.customA'),
  },
  {
    question: t('product.faq.shippingQ'),
    answer: t('product.faq.shippingA'),
  },
  {
    question: t('product.faq.returnsQ'),
    answer: t('product.faq.returnsA'),
  },
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const result = await fetchProductBySlug(slug || '');
        if (result) {
          const cat = result.category ? transformCategory(result.category) : null;
          setCategory(cat);

          const prod = transformProduct(result.product, result.media, 0);
          setProduct(prod);

          const { products: dbProducts, media } = await fetchProducts();
          const related = dbProducts
            .filter((p) => p.id !== result.product.id && p.category_id === result.product.category_id)
            .slice(0, 4)
            .map((p, i) => transformProduct(p, media[p.id] || [], i + 100));
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProduct();
      setQuantity(1);
      setAddedToCart(false);
      setSelectedImage(0);
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (loading) {
    return (
      <MainLayout>
        <ProductDetailSkeleton />
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <Reveal delay={0} dir="up" distance={30}>
          <div className="section-padding py-20 text-center">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-cream-100">
              <i className="ri-error-warning-line text-3xl text-espresso-400"></i>
            </div>
            <h2 className="font-heading font-bold text-xl text-espresso-900 mb-2">
              Product Not Found
            </h2>
            <Link to="/products" className="btn-primary mt-4 inline-block">
              Back to Products
            </Link>
          </div>
        </Reveal>
      </MainLayout>
    );
  }

  const isOutOfStock = product.stockQty === 0;
  const imageUrl = product.media[selectedImage]?.url || product.media[0]?.url || '';

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const whatsappMessage = `Hello, I'd like to ask about: ${product.name} (SKU: ${product.sku})`;

  const faqs = faqItems(t, product.name);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/products/${product.slug}#faq`,
    'mainEntity': faqs.map((f) => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer,
      },
    })),
  };

  return (
    <MainLayout whatsappMessage={whatsappMessage}>
      <JsonLd data={faqSchema} />
      <div className="bg-white">
        <div className="section-padding py-6 md:py-10">
          {/* Breadcrumb */}
          <Reveal delay={0} dir="up" distance={16} duration={0.5}>
            <nav className="flex items-center gap-2 text-sm font-body text-espresso-500 mb-8">
              <Link to="/" className="hover:text-gold-600 transition-colors">Home</Link>
              <i className="ri-arrow-right-s-line text-xs"></i>
              <Link to="/products" className="hover:text-gold-600 transition-colors">Products</Link>
              <i className="ri-arrow-right-s-line text-xs"></i>
              {category && (
                <>
                  <Link to={`/products?category=${category.slug}`} className="hover:text-gold-600 transition-colors">{category.name}</Link>
                  <i className="ri-arrow-right-s-line text-xs"></i>
                </>
              )}
              <span className="text-espresso-900">{product.name}</span>
            </nav>
          </Reveal>

          {/* Product Main */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
            {/* Image Column */}
            <div className="space-y-4">
              <ScaleReveal delay={0.1}>
                <div
                  className="aspect-square rounded-2xl overflow-hidden bg-cream-50 border border-cream-200 cursor-zoom-in group relative"
                  onClick={() => setLightboxOpen(true)}
                >
                  <motion.img
                    key={selectedImage}
                    src={imageUrl}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5">
                    <span className="px-4 py-2 rounded-full bg-white/90 text-espresso-900 font-heading text-xs font-semibold flex items-center gap-1.5">
                      <i className="ri-zoom-in-line"></i>
                      Click to Zoom
                    </span>
                  </div>
                </div>
              </ScaleReveal>

              {product.media.length > 1 && (
                <Reveal delay={0.25} dir="up" distance={20} duration={0.5}>
                  <div className="flex gap-3">
                    {product.media.map((m, i) => (
                      <motion.button
                        key={m.id}
                        onClick={() => setSelectedImage(i)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-20 h-20 rounded-xl overflow-hidden bg-cream-50 border-2 cursor-pointer transition-colors ${
                          selectedImage === i ? 'border-gold-400' : 'border-cream-200'
                        }`}
                      >
                        <img src={m.url} alt={product.name} className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Info Column */}
            <div className="flex flex-col">
              <Reveal delay={0.1} dir="up" distance={20} duration={0.5}>
                <div className="mb-3">{getStockBadge(product.stockQty)}</div>
              </Reveal>

              <SpringReveal delay={0.15} dir="up" distance={36}>
                <h1 className="font-heading font-black text-2xl md:text-4xl text-espresso-900 mb-4">{product.name}</h1>
              </SpringReveal>

              <Reveal delay={0.25} dir="up" distance={24} duration={0.7}>
                <p className="font-body text-base text-espresso-500 leading-relaxed mb-6">{product.description}</p>
              </Reveal>

              <LineDraw delay={0.3} className="mb-6" />

              <Reveal delay={0.35} dir="up" distance={20} duration={0.6}>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold text-sm text-espresso-900 w-24">{t('product.material')}</span>
                    <span className="font-body text-sm text-espresso-500">{product.material}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold text-sm text-espresso-900 w-24">{t('product.dimensions')}</span>
                    <span className="font-body text-sm text-espresso-500">{product.dimensions}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold text-sm text-espresso-900 w-24">SKU</span>
                    <span className="font-body text-sm text-espresso-500">{product.sku}</span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.45} dir="up" distance={30} duration={0.6}>
                <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-cream-200">
                  <span className="font-heading font-black text-3xl md:text-4xl text-gold-600">{product.price.toLocaleString('en-US')}</span>
                  <span className="font-body text-lg text-espresso-500">{t('common.EGP')}</span>
                </div>
              </Reveal>

              {/* Quantity + Add to Cart */}
              <Reveal delay={0.55} dir="up" distance={24} duration={0.6}>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex items-center border border-cream-300 rounded-full overflow-hidden bg-white">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-cream-50 transition-colors text-espresso-900 cursor-pointer"
                      disabled={isOutOfStock}
                    >
                      <i className="ri-subtract-line"></i>
                    </motion.button>
                    <span className="w-14 text-center font-heading font-bold text-espresso-900">{quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-cream-50 transition-colors text-espresso-900 cursor-pointer"
                      disabled={isOutOfStock || quantity >= product.stockQty}
                    >
                      <i className="ri-add-line"></i>
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3.5 px-6 rounded-full font-heading font-semibold text-base transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      isOutOfStock
                        ? 'bg-cream-100 text-espresso-400 cursor-not-allowed'
                        : addedToCart
                        ? 'bg-espresso-800 text-white'
                        : 'btn-primary'
                    }`}
                  >
                    {isOutOfStock ? (
                      'Out of Stock'
                    ) : addedToCart ? (
                      <span className="flex items-center justify-center gap-2"><i className="ri-check-line"></i>Added to Cart</span>
                    ) : (
                      <span className="flex items-center justify-center gap-2"><i className="ri-shopping-bag-3-line"></i>{t('products.addToCart')}</span>
                    )}
                  </motion.button>
                </div>
              </Reveal>

              <Reveal delay={0.65} dir="up" distance={20} duration={0.6}>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://wa.me/201012345678?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-full border border-gold-300 text-gold-600 font-heading font-semibold text-sm hover:bg-gold-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-whatsapp-line text-lg"></i>
                  {t('product.askWhatsApp')}
                </motion.a>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-padding">
          <SectionHeader
            label={t('product.faq.label')}
            title={t('product.faq.title')}
          />
          <div className="max-w-3xl mx-auto mt-8">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={0.06 * i} dir="up" distance={16} duration={0.4}>
                <div className="border-b border-cream-200/60">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group"
                  >
                    <span className="font-heading font-semibold text-base md:text-lg text-espresso-900 group-hover:text-gold-700 transition-colors pr-4">
                      {faq.question}
                    </span>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === i ? 'bg-gold-100 text-gold-600 rotate-45' : 'bg-cream-50 text-espresso-400 group-hover:bg-cream-100'}`}>
                      <i className="ri-add-line text-lg"></i>
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === i ? 'auto' : 0,
                      opacity: openFaq === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-sm md:text-base text-espresso-500 leading-relaxed pb-5 px-1">
                      {faq.answer}
                    </p>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-cream-50 py-16 md:py-24">
          <div className="section-padding">
            <SectionHeader
              label="You May Also Like"
              title="More to Love"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {relatedProducts.map((p, i) => (
                <SpringReveal key={p.id} delay={0.06 * i} dir="up" distance={40}>
                  <ProductCard product={p} />
                </SpringReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <ProductLightbox
        images={product.media.map((m) => ({ url: m.url, alt: product.name }))}
        currentIndex={selectedImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setSelectedImage((prev) => (prev - 1 + product.media.length) % product.media.length)}
        onNext={() => setSelectedImage((prev) => (prev + 1) % product.media.length)}
      />
    </MainLayout>
  );
}