import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { fetchCategories, fetchProducts, transformCategory, transformProduct } from '@/lib/api';
import type { Category, Product } from '@/types';
import ProductCard from '@/components/feature/ProductCard';
import ProductCardSkeleton from '@/components/feature/ProductCardSkeleton';
import Skeleton from '@/components/base/Skeleton';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, SectionHeader, PageHeader } from '@/components/feature/EditorialReveal';
import { useScrollRestore } from '@/hooks/useScrollRestoration';
import JsonLd from '@/components/feature/JsonLd';

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://settelhetta.com';

const materials = [
  { value: 'all', label: 'All Materials' },
  { value: 'فولاذ مقاوم للصدأ مطلي بالذهب', label: 'Gold-Plated Steel' },
  { value: 'فولاذ مقاوم للصدأ مطلي بالفضة', label: 'Silver-Plated Steel' },
  { value: 'خرز زجاجي', label: 'Gold with Beads' },
  { value: 'عين زرقاء', label: 'Gold with Blue Eye' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const priceRanges = [
  { value: 'all', label: 'All Prices', min: 0, max: Infinity },
  { value: 'under-300', label: 'Under 300 EGP', min: 0, max: 300 },
  { value: '300-500', label: '300 — 500 EGP', min: 300, max: 500 },
  { value: '500-800', label: '500 — 800 EGP', min: 500, max: 800 },
  { value: 'over-800', label: 'Over 800 EGP', min: 800, max: Infinity },
];

export default function ProductsPage() {
  const { t } = useTranslation();
  useScrollRestore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const selectedCategory = searchParams.get('category') || 'all';
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [dbCategories, { products: dbProducts, media }] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);

        setCategories(dbCategories.map((cat) => transformCategory(cat)));
        setProducts(dbProducts.map((p, i) => transformProduct(p, media[p.id] || [], i)));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      const category = categories.find((c) => c.slug === selectedCategory);
      if (category) {
        result = result.filter((p) => p.categoryId === category.id);
      }
    }

    if (selectedMaterial !== 'all') {
      result = result.filter((p) => p.material.includes(selectedMaterial));
    }

    if (selectedPriceRange !== 'all') {
      const range = priceRanges.find((r) => r.value === selectedPriceRange);
      if (range) {
        result = result.filter(
          (p) => p.price >= range.min && p.price <= range.max
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [products, categories, selectedCategory, selectedMaterial, selectedPriceRange, searchQuery, sortBy]);

  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSelectedMaterial('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedMaterial !== 'all' ||
    selectedPriceRange !== 'all' ||
    searchQuery.trim();

  return (
    <MainLayout>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/products#collection`,
        'name': 'مجموعة الإكسسوارات | ست الحتة',
        'description': 'تصفحي أحدث تشكيلات الإكسسوارات المصنوعة يدوياً — أساور، خلاخيل، سلاسل، خواتم، وأطقم مطلية بالذهب عيار ١٨ من خان الخليلي',
        'url': `${siteUrl}/products`,
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
        label="The Collection"
        title={t('products.title')}
        description={t('products.subtitle')}
        bgImage="https://readdy.ai/api/search-image?query=Luxurious%20gold%20jewelry%20collection%20artfully%20arranged%20on%20cream%20marble%20surface%2C%20delicate%20layered%20necklaces%20and%20bracelets%2C%20soft%20warm%20natural%20light%2C%20editorial%20product%20photography%2C%20rich%20gold%20and%20cream%20tones%2C%20elegant%20minimal%20composition%2C%20high-end%20fashion%20campaign%20aesthetic%2C%20shallow%20depth%20of%20field&width=1600&height=600&seq=products-hero&orientation=landscape&nocache=true"
      />

      {/* ══════════════════ FILTER BAR ══════════════════ */}
      <div className="bg-white border-b border-cream-200">
        <div className="section-padding py-5 md:py-6">
          <Reveal delay={0.1} dir="up" distance={20} duration={0.6}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <i className="ri-search-line absolute top-1/2 -translate-y-1/2 text-espresso-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('products.search.placeholder')}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-cream-300 bg-cream-50 font-body text-sm text-espresso-900 focus:outline-none focus:border-gold-400 focus:bg-white focus:ring-1 focus:ring-gold-200/50 transition-all placeholder:text-espresso-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-espresso-400 hover:text-espresso-600 transition-colors"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-full border border-cream-300 bg-white font-body text-sm text-espresso-900 focus:outline-none focus:border-gold-400 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-full border font-body text-sm flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                    showFilters || hasActiveFilters
                      ? 'border-gold-400 text-gold-600 bg-gold-50'
                      : 'border-cream-300 bg-white text-espresso-700'
                  }`}
                >
                  <i className="ri-filter-3-line"></i>
                  <span className="hidden sm:inline">{t('common.filter')}</span>
                </motion.button>
              </div>
            </div>
          </Reveal>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <Reveal delay={0.05} dir="up" distance={16} duration={0.5}>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold-50 text-gold-700 text-xs font-heading font-medium">
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gold-100 transition-colors"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                )}
                {selectedMaterial !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold-50 text-gold-700 text-xs font-heading font-medium">
                    {materials.find((m) => m.value === selectedMaterial)?.label}
                    <button
                      onClick={() => setSelectedMaterial('all')}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gold-100 transition-colors"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                )}
                {selectedPriceRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold-50 text-gold-700 text-xs font-heading font-medium">
                    {priceRanges.find((r) => r.value === selectedPriceRange)?.label}
                    <button
                      onClick={() => setSelectedPriceRange('all')}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gold-100 transition-colors"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold-50 text-gold-700 text-xs font-heading font-medium">
                    {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gold-100 transition-colors"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs font-body text-espresso-500 hover:text-gold-600 underline transition-colors"
                >
                  {t('common.clear')}
                </button>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* ══════════════════ FILTERS PANEL ══════════════════ */}
      {showFilters && (
        <div className="bg-cream-50 border-b border-cream-200">
          <div className="section-padding py-6">
            <ScaleReveal delay={0.05}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-heading font-semibold text-sm text-espresso-900 mb-3">
                    {t('products.filter.category')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-gold-500 text-white'
                          : 'bg-white text-espresso-600 border border-cream-300 hover:border-gold-300'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-colors ${
                          selectedCategory === cat.slug
                            ? 'bg-gold-500 text-white'
                            : 'bg-white text-espresso-600 border border-cream-300 hover:border-gold-300'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-semibold text-sm text-espresso-900 mb-3">
                    {t('products.filter.material')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((mat) => (
                      <button
                        key={mat.value}
                        onClick={() =>
                          setSelectedMaterial(
                            selectedMaterial === mat.value ? 'all' : mat.value
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-colors ${
                          selectedMaterial === mat.value
                            ? 'bg-gold-500 text-white'
                            : 'bg-white text-espresso-600 border border-cream-300 hover:border-gold-300'
                        }`}
                      >
                        {mat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-semibold text-sm text-espresso-900 mb-3">
                    {t('products.filter.price')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() =>
                          setSelectedPriceRange(
                            selectedPriceRange === range.value ? 'all' : range.value
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-colors ${
                          selectedPriceRange === range.value
                            ? 'bg-gold-500 text-white'
                            : 'bg-white text-espresso-600 border border-cream-300 hover:border-gold-300'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScaleReveal>
          </div>
        </div>
      )}

      {/* ══════════════════ RESULTS ══════════════════ */}
      <section className="bg-cream-50 py-10 md:py-14">
        <div className="section-padding">
          {loading ? (
            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Skeleton className="flex-1 h-12 !rounded-full" />
                <Skeleton className="h-12 w-28 !rounded-full" />
                <Skeleton className="h-12 w-28 !rounded-full" />
              </div>
              <Skeleton className="h-4 w-20 mb-4 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      animationDelay: `${i * 0.06}s`,
                      opacity: 0,
                      animation: 'reveal-up 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
                    }}
                  >
                    <ProductCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <Reveal delay={0.1} dir="up" distance={30}>
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-cream-100">
                  <i className="ri-error-warning-line text-3xl text-espresso-400"></i>
                </div>
                <p className="font-body text-sm text-espresso-500 mb-3">Failed to load products</p>
                <button onClick={() => window.location.reload()} className="btn-outline text-sm">
                  Retry
                </button>
              </div>
            </Reveal>
          ) : (
            <>
              <Reveal delay={0.1} dir="up" distance={20} duration={0.5}>
                <p className="font-body text-sm text-espresso-500 mb-6">
                  {filteredProducts.length} products
                </p>
              </Reveal>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                  {filteredProducts.map((product, index) => (
                    <SpringReveal
                      key={product.id}
                      delay={0.04 * index}
                      dir="up"
                      distance={40}
                    >
                      <ProductCard product={product} />
                    </SpringReveal>
                  ))}
                </div>
              ) : (
                <Reveal delay={0.15} dir="up" distance={30}>
                  <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-cream-100">
                      <i className="ri-search-line text-3xl text-espresso-400"></i>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-espresso-900 mb-2">
                      No Results Found
                    </h3>
                    <p className="font-body text-sm text-espresso-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </Reveal>
              )}
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}