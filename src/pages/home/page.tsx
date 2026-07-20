import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { fetchCategories, fetchProducts, transformCategory, transformProduct } from '@/lib/api';
import type { Category, Product } from '@/types';
import ProductCard from '@/components/feature/ProductCard';
import ProductCardSkeleton from '@/components/feature/ProductCardSkeleton';
import MainLayout from '@/components/feature/MainLayout';
import { useScrollRestore } from '@/hooks/useScrollRestoration';
import JsonLd from '@/components/feature/JsonLd';

const NEWSLETTER_FORM_URL = 'https://readdy.ai/api/form/d9emvcd64bc39gr2q6cg';
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://settelhetta.com';

// ─── Animation Primitives ───────────────────────────────────────

function Reveal({ children, className = '', delay = 0, dir = 'up', distance = 48, duration = 0.8, once = true }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  dir?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px' });
  const dirMap: Record<string, object> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirMap[dir] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...dirMap[dir] }}
      transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SpringReveal({ children, className = '', delay = 0, dir = 'up', distance = 48 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  dir?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const dirMap: Record<string, object> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirMap[dir] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...dirMap[dir] }}
      transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScaleReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function LineDraw({ className = '', delay = 0, width = 'w-16', color = 'bg-gold-300' }: { className?: string; delay?: number; width?: string; color?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 0.61, 0.36, 1] }}
        className={`h-px ${width} ${color} origin-right`}
      />
    </div>
  );
}

function PullQuote({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative pr-6 my-8 overflow-hidden">
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute right-0 top-0 bottom-0 w-0.5 bg-gold-400 origin-top rounded-full"
      />
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.7, delay: delay + 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        className="font-heading text-xl md:text-2xl text-espresso-800 leading-relaxed italic"
      >
        {children}
      </motion.p>
    </div>
  );
}

function ParallaxImage({ src, alt, className = '', speed = 0.2, enterDelay = 0 }: { src: string; alt: string; className?: string; speed?: number; enterDelay?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.3, 1], [1.08, 1, 1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: enterDelay, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ y, scale: imgScale }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────────

function SectionHeader({ label, title, description, delay = 0 }: { label: string; title: string; description?: string; delay?: number }) {
  return (
    <div className="text-center mb-16 md:mb-20">
      <Reveal delay={delay} dir="none" duration={0.6}>
        <span className="font-heading text-[11px] font-semibold tracking-[0.3em] text-gold-500 uppercase">
          {label}
        </span>
      </Reveal>
      <SpringReveal delay={delay + 0.1} dir="up" distance={40}>
        <h2 className="font-heading font-black text-3xl md:text-5xl lg:text-6xl text-espresso-900 mt-4 mb-5 leading-tight">
          {title.split('<br/>').map((line, i) => (
            <span key={i}>
              {i > 0 && <br className="md:hidden" />}
              {line}
            </span>
          ))}
        </h2>
      </SpringReveal>
      <LineDraw delay={delay + 0.25} />
      {description && (
        <Reveal delay={delay + 0.35} dir="up" distance={20} duration={0.7}>
          <p className="font-body text-base md:text-lg text-espresso-500 max-w-md mx-auto mt-5 leading-relaxed">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────

const categoryEdges = [
  { slug: 'necklaces', label: 'Necklaces', icon: 'ri-vip-diamond-line', image: 'https://readdy.ai/api/search-image?query=Luxurious%20gold%20necklaces%20displayed%20on%20dark%20velvet%20fabric%20background%2C%20multiple%20layered%20chains%20and%20pendants%20in%20warm%20golden%20light%2C%20editorial%20jewelry%20photography%2C%20rich%20deep%20background%20with%20soft%20highlights%2C%20elegant%20composition%2C%20moody%20atmospheric%20lighting&width=600&height=600&seq=cat-necklaces-bg&orientation=squarish' },
  { slug: 'bracelets', label: 'Bracelets', icon: 'ri-circle-line', image: 'https://readdy.ai/api/search-image?query=Elegant%20gold%20bracelets%20and%20bangles%20arranged%20artistically%20on%20dark%20silk%20fabric%2C%20warm%20golden%20highlights%20reflecting%20off%20metal%20surfaces%2C%20editorial%20jewelry%20photography%2C%20luxury%20product%20shot%2C%20rich%20dark%20background%20with%20soft%20warm%20lighting%2C%20sophisticated%20composition&width=600&height=600&seq=cat-bracelets-bg&orientation=squarish' },
  { slug: 'rings', label: 'Rings', icon: 'ri-checkbox-blank-circle-line', image: 'https://readdy.ai/api/search-image?query=Delicate%20gold%20rings%20and%20stacking%20bands%20displayed%20on%20dark%20marble%20surface%2C%20soft%20warm%20spotlight%20creating%20golden%20glow%20on%20metal%2C%20editorial%20jewelry%20photography%2C%20luxury%20product%20shot%2C%20moody%20dark%20background%20with%20rich%20warm%20tones%2C%20elegant%20minimal%20composition&width=600&height=600&seq=cat-rings-bg&orientation=squarish' },
  { slug: 'earrings', label: 'Earrings', icon: 'ri-sparkling-line', image: 'https://readdy.ai/api/search-image?query=Beautiful%20gold%20drop%20earrings%20and%20studs%20arranged%20on%20dark%20textured%20surface%2C%20warm%20golden%20light%20catching%20crystals%20and%20metal%20details%2C%20editorial%20jewelry%20photography%2C%20luxury%20product%20shot%2C%20rich%20dark%20background%20with%20soft%20atmospheric%20lighting%2C%20sophisticated%20composition&width=600&height=600&seq=cat-earrings-bg&orientation=squarish' },
  { slug: 'anklets', label: 'Anklets', icon: 'ri-footprint-line', image: 'https://readdy.ai/api/search-image?query=Delicate%20gold%20anklets%20and%20chain%20foot%20jewelry%20displayed%20on%20dark%20linen%20fabric%20with%20soft%20petals%2C%20warm%20golden%20light%20highlighting%20fine%20chain%20details%2C%20editorial%20jewelry%20photography%2C%20luxury%20product%20shot%2C%20moody%20dark%20background%20with%20warm%20tones%2C%20elegant%20composition&width=600&height=600&seq=cat-anklets-bg&orientation=squarish' },
  { slug: 'sets', label: 'Sets', icon: 'ri-stack-line', image: 'https://readdy.ai/api/search-image?query=Complete%20gold%20jewelry%20set%20including%20necklace%20bracelet%20earrings%20and%20ring%20arranged%20together%20on%20dark%20velvet%20surface%2C%20warm%20golden%20light%20illuminating%20matching%20designs%2C%20editorial%20jewelry%20photography%2C%20luxury%20product%20shot%2C%20rich%20dark%20background%20with%20soft%20highlights%2C%20sophisticated%20composition&width=600&height=600&seq=cat-sets-bg&orientation=squarish' },
];

// ─── Category Card with Parallax ──────────────────────────────

function CategoryCard({ cat, index }: { cat: typeof categoryEdges[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div ref={ref}>
      <ScaleReveal delay={index * 0.07}>
        <Link
          to={`/products?category=${cat.slug}`}
          className="group relative block rounded-2xl overflow-hidden cursor-pointer h-[220px] md:h-[280px] lg:h-[320px]"
        >
          {/* Parallax background image */}
          <div className="absolute top-[-12.5%] left-0 w-full h-[125%] group-hover:scale-110 transition-transform duration-700 ease-out">
            <motion.img
              src={cat.image}
              alt={cat.label}
              style={{ y }}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-500" />
          {/* Warm gold edge glow on hover */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-400/30 rounded-2xl transition-colors duration-500" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
            <motion.div
              whileHover={{ rotate: [0, -6, 6, 0], transition: { duration: 0.6 } }}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-500"
            >
              <i className={`${cat.icon} text-2xl text-gold-300 group-hover:text-gold-200 transition-colors duration-500`}></i>
            </motion.div>
            <span className="font-heading font-bold text-sm md:text-base text-white group-hover:text-gold-100 transition-colors duration-500 whitespace-nowrap" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
              {cat.label}
            </span>
            <span className="w-0 group-hover:w-8 h-px bg-gold-300 transition-all duration-500" />
            <span className="font-body text-xs text-white/60 group-hover:text-white/80 transition-colors duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
              Explore
            </span>
          </div>
        </Link>
      </ScaleReveal>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────

export default function HomePage() {
  const { t } = useTranslation();
  useScrollRestore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [dbCategories, { products: dbProducts, media }] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        const mappedCategories = dbCategories.map((cat) => transformCategory(cat));
        setCategories(mappedCategories);
        const allProducts = dbProducts.map((p, i) =>
          transformProduct(p, media[p.id] || [], i)
        );
        setFeaturedProducts(allProducts.filter((p) => p.featured).slice(0, 3));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <MainLayout whatsappMessage="Hello, I'd like to inquire about Sett El Heta products">

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'JewelryStore',
        '@id': `${siteUrl}/#store`,
        'name': 'ست الحتة',
        'alternateName': 'Sett El-Hetta',
        'url': siteUrl,
        'description': 'إكسسوارات وإكسسوارات يدوية فاخرة مصنوعة يدوياً من قلب خان الخليلي بالقاهرة — أساور، خلاخيل، سلاسل، خواتم، وأطقم مطلية بالذهب عيار ١٨',
        'image': 'https://readdy.ai/api/search-image?query=Elegant%20Egyptian%20gold%20jewelry%20collection%20with%20layered%20necklaces%20bracelets%20and%20rings%20displayed%20on%20cream%20linen%20fabric%2C%20warm%20natural%20sunlight%2C%20luxury%20editorial%20photography%2C%20soft%20beige%20and%20gold%20tones%2C%20sophisticated%20artisan%20craft%20aesthetic&width=1200&height=630&seq=og-home-shared&orientation=landscape',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'خان الخليلي',
          'addressLocality': 'القاهرة',
          'addressCountry': 'EG',
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': '30.047454',
          'longitude': '31.232971',
        },
        'telephone': '+20-10-1234-5678',
        'priceRange': 'EGP 100 - EGP 5000',
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            'opens': '10:00',
            'closes': '22:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': 'Friday',
            'opens': '14:00',
            'closes': '22:00',
          },
        ],
        'sameAs': [
          'https://instagram.com/settelhetta',
          'https://facebook.com/settelhetta',
        ],
      }} />

      {/* ══════════════════ EDITORIAL HERO ══════════════════ */}
      <section className="relative h-screen min-h-[700px] max-h-[900px] flex items-center bg-white overflow-hidden">
        {/* Background image with scale-in entrance */}
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute inset-0"
        >
          <ParallaxImage
            src="https://readdy.ai/api/search-image?query=Elegant%20Egyptian%20model%20wearing%20delicate%20handmade%20gold%20layered%20necklaces%20and%20bracelets%20posed%20against%20a%20soft%20warm%20cream%20linen%20backdrop%2C%20editorial%20fashion%20photography%2C%20diffused%20natural%20window%20light%20casting%20gentle%20shadows%2C%20minimal%20clean%20composition%20with%20generous%20negative%20space%2C%20luxury%20magazine%20cover%20aesthetic%2C%20warm%20neutral%20beige%20and%20gold%20tones%2C%20sophisticated%20modern%20Middle%20Eastern%20jewelry%20editorial%2C%20high-end%20fashion%20campaign%2C%20cinematic%20soft%20focus%2C%20timeless%20elegance&width=1800&height=1200&seq=editorial-hero-cover&orientation=landscape"
            alt="Sett El Heta — Luxury Jewelry"
            className="absolute inset-0"
            enterDelay={0}
          />
        </motion.div>

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute inset-0 bg-gradient-to-r from-black/5 via-black/20 to-black/40"
        />

        {/* Content */}
        <div className="section-padding relative z-10 w-full">
          <div className="max-w-2xl">
            {/* Location tag */}
            <motion.p
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-heading text-xs sm:text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase mb-6"
            >
              Khan El Khalili · Cairo
            </motion.p>

            {/* H1 — two lines staggered */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 max-w-xl"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.3)' }}>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                  className="block"
                >
                  Jewelry
                </motion.span>
              </span>
              <span className="block overflow-hidden text-gold-300">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
                  className="block"
                >
                  That Tells a Story
                </motion.span>
              </span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-body text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-md"
              style={{ textShadow: '0 1px 20px rgba(0,0,0,0.4)' }}
            >
              Each Sett El Heta piece is handcrafted in the alleys of Khan El Khalili — where heritage meets modern elegance
            </motion.p>

            {/* CTAs staggered */}
            <div className="flex flex-wrap gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/products" className="btn-primary px-10 py-4 text-base">
                  Discover the Collection
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.35, ease: [0.22, 0.61, 0.36, 1] }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/our-story"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-heading font-semibold text-base text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-500 whitespace-nowrap cursor-pointer"
                >
                  Our Story
                  <i className="ri-arrow-left-line"></i>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="font-heading text-xs text-white/50 tracking-widest"
          >
            Scroll down
          </motion.span>
          <motion.div
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent origin-top"
          />
        </motion.div>
      </section>

      {/* ══════════════════ EDITOR'S SELECTION ══════════════════ */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        {/* Warm editorial marble texture background */}
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=Soft%20warm%20cream%20marble%20texture%20with%20subtle%20golden%20veins%20and%20gentle%20natural%20light%20reflections%2C%20elegant%20minimalist%20surface%20for%20luxury%20jewelry%20display%2C%20very%20light%20beige%20and%20ivory%20tones%2C%20barely%20visible%20organic%20marbling%2C%20premium%20editorial%20backdrop%2C%20soft%20diffused%20warm%20lighting%2C%20delicate%20warm%20atmosphere&width=1600&height=1000&seq=editorial-selection-bg&orientation=landscape"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-50/88 via-cream-50/95 to-cream-50/88" />
        </div>
        <div className="section-padding relative z-10">
          <SectionHeader
            label="Editor's Selection"
            title="Pieces Worth<br/>Owning"
            description="A curated selection of our finest handcrafted pieces this season"
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0,
                    animation: 'reveal-up 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
                  }}
                >
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : error ? (
            <Reveal className="text-center py-12">
              <p className="font-body text-espresso-500 mb-4">Failed to load products</p>
              <button onClick={() => window.location.reload()} className="btn-outline text-sm">Retry</button>
            </Reveal>
          ) : (
            <>
              {/* Product cards — each from a different direction */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
                {featuredProducts.map((product, index) => {
                  const dirs: Array<'right' | 'up' | 'left'> = ['right', 'up', 'left'];
                  return (
                    <SpringReveal key={product.id} delay={0.15 + index * 0.12} dir={dirs[index]} distance={60}>
                      <ProductCard product={product} />
                    </SpringReveal>
                  );
                })}
              </div>

              <Reveal delay={0.5} dir="up" distance={20}>
                <div className="text-center mt-16">
                  <Link to="/products" className="inline-flex items-center gap-2 font-heading font-semibold text-sm text-espresso-700 hover:text-gold-600 transition-colors group">
                    View All Products
                    <motion.i
                      whileHover={{ x: 3 }}
                      className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform duration-300"
                    ></motion.i>
                  </Link>
                </div>
              </Reveal>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════ CATEGORIES — IMAGE BACKGROUNDS ══════════════════ */}
      <section className="relative py-24 md:py-32 bg-cream-50 overflow-hidden">
        <div className="section-padding">
          <Reveal dir="none" duration={0.6}>
            <span className="font-heading text-[11px] font-semibold tracking-[0.3em] text-gold-500 uppercase">
              Browse Collections
            </span>
          </Reveal>
          <SpringReveal delay={0.1} dir="up" distance={30}>
            <h2 className="font-heading font-black text-3xl md:text-5xl lg:text-6xl text-espresso-900 mt-4 mb-16 md:mb-20 leading-tight">
              By Category
            </h2>
          </SpringReveal>

          {/* Category grid — 6 editorial image cards with parallax */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {categoryEdges.map((cat, i) => (
              <CategoryCard key={cat.slug} cat={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ BRAND NARRATIVE ══════════════════ */}
      <section className="relative py-24 md:py-36 bg-white overflow-hidden">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16 items-center">

              {/* Image with scale reveal */}
              <ScaleReveal className="lg:col-span-3" delay={0.1}>
                <ParallaxImage
                  src="https://readdy.ai/api/search-image?query=Traditional%20Egyptian%20goldsmith%20artisan%20hands%20meticulously%20crafting%20a%20delicate%20gold%20necklace%20in%20a%20sunlit%20Khan%20El%20Khalili%20workshop%2C%20warm%20natural%20light%20streaming%20through%20aged%20wooden%20shutters%2C%20authentic%20vintage%20brass%20tools%20on%20weathered%20wooden%20workbench%2C%20shallow%20depth%20of%20field%20focusing%20on%20hands%20and%20gold%20details%2C%20editorial%20documentary%20photography%2C%20rich%20warm%20sepia%20and%20gold%20tones%2C%20cinematic%20composition%2C%20sense%20of%20heritage%20and%20timeless%20craftsmanship%2C%20soft%20atmospheric%20glow&width=1000&height=750&seq=editorial-workshop&orientation=landscape"
                  alt="Artisan in Khan El Khalili workshop"
                  className="aspect-[4/3] lg:aspect-[4/5]"
                  speed={0.15}
                  enterDelay={0.1}
                />
              </ScaleReveal>

              {/* Text — staggered reveals */}
              <div className="lg:col-span-2">
                <Reveal delay={0.15} dir="none" duration={0.5}>
                  <span className="font-heading text-[11px] font-semibold tracking-[0.3em] text-gold-500 uppercase">
                    Our Story
                  </span>
                </Reveal>

                <SpringReveal delay={0.25} dir="up" distance={40}>
                  <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-espresso-900 mt-4 mb-6 leading-tight">
                    From the Artisan's Hands<br />To Your Wrist
                  </h2>
                </SpringReveal>

                <Reveal delay={0.4} dir="up" distance={24} duration={0.7}>
                  <p className="font-body text-base md:text-lg text-espresso-500 leading-relaxed mb-6">
                    For over a quarter century, in the ancient alleyways of Khan El Khalili, we began our passion for crafting jewelry.
                    We learned the secrets of the trade from master artisans, passing them down generation after generation.
                  </p>
                </Reveal>

                {/* Pull quote with border draw + text reveal */}
                <PullQuote delay={0.55}>
                  &ldquo;Every piece we craft carries the spirit of the place and the warmth of the hands that made it&rdquo;
                </PullQuote>

                <Reveal delay={0.7} dir="up" distance={24} duration={0.7}>
                  <p className="font-body text-base text-espresso-500 leading-relaxed mb-8">
                    We believe an accessory is not just an adornment — it is an extension of your personality, a story you tell
                    with every piece of Sett El Heta you wear.
                  </p>
                </Reveal>

                <Reveal delay={0.85} dir="up" distance={16} duration={0.6}>
                  <Link to="/our-story" className="inline-flex items-center gap-2 font-heading font-bold text-sm text-gold-600 hover:text-gold-700 transition-colors group">
                    Read the Full Story
                    <motion.i
                      whileHover={{ x: 3 }}
                      className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform duration-300"
                    ></motion.i>
                  </Link>
                </Reveal>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ THE JOURNAL — SLIDE-IN PANELS ══════════════════ */}
      <section className="relative py-24 md:py-36 bg-cream-50 overflow-hidden">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Text panel — slides from right (RTL) */}
              <Reveal dir="right" distance={80} className="order-2 lg:order-1">
                <div className="bg-white p-10 md:p-14 lg:p-16 flex flex-col justify-center h-full">
                  <span className="font-heading text-[10px] font-semibold tracking-[0.3em] text-gold-500 uppercase mb-4">
                    Summer Gold 2026
                  </span>
                  <h2 className="font-heading font-black text-2xl md:text-3xl lg:text-4xl text-espresso-900 mb-4 leading-tight">
                    The Lightness of Gold<br />The Warmth of Sun
                  </h2>
                  <p className="font-body text-sm md:text-base text-espresso-500 leading-relaxed mb-8">
                    A collection inspired by Cairo's sunlight on summer nights — soft,
                    lightweight designs perfect for your long days and warm evenings. Each piece
                    is crafted to accompany you wherever you go.
                  </p>
                  <div>
                    <Link to="/products?collection=summer" className="inline-flex items-center gap-2 font-heading font-bold text-sm text-gold-600 hover:text-gold-700 transition-colors group">
                      Discover the Collection
                      <motion.i
                        whileHover={{ x: 3 }}
                        className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform duration-300"
                      ></motion.i>
                    </Link>
                  </div>
                </div>
              </Reveal>

              {/* Image panel — slides from left (RTL) */}
              <Reveal dir="left" distance={80} className="order-1 lg:order-2">
                <ParallaxImage
                  src="https://readdy.ai/api/search-image?query=Elegant%20collection%20of%20delicate%20gold%20layered%20necklaces%20and%20thin%20bracelets%20arranged%20artistically%20on%20cream%20linen%20fabric%20with%20jasmine%20flowers%20scattered%20around%2C%20warm%20Mediterranean%20summer%20sunlight%20streaming%20from%20the%20left%20creating%20soft%20golden%20highlights%2C%20luxurious%20editorial%20product%20photography%2C%20shallow%20depth%20of%20field%2C%20beige%20and%20soft%20gold%20tones%2C%20clean%20minimal%20composition%20with%20organic%20negative%20space%2C%20sophisticated%20jewelry%20editorial%20for%20a%20fashion%20magazine%2C%20timeless%20natural%20elegance&width=900&height=1100&seq=editorial-summer-collection&orientation=portrait"
                  alt="Summer Gold Collection"
                  className="aspect-[3/4] lg:aspect-auto lg:h-full"
                  speed={0.12}
                  enterDelay={0.15}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ NEW ARRIVALS — FEATURED COLLECTION BANNER ══════════════════ */}
      <section className="relative py-24 md:py-36 bg-white overflow-hidden">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              label="Just Landed"
              title="New Arrivals"
              description="Fresh from the workshop — our latest handcrafted pieces, each one made with the same care and attention to detail"
            />

            {/* Featured Collection Banner */}
            <ScaleReveal delay={0.15}>
              <Link
                to="/products?sort=newest"
                className="group relative block w-full rounded-3xl overflow-hidden cursor-pointer"
              >
                {/* Background image */}
                <div className="relative aspect-[21/9] md:aspect-[21/7] overflow-hidden">
                  <motion.img
                    src="https://readdy.ai/api/search-image?query=Luxurious%20editorial%20flatlay%20of%20multiple%20gold%20jewelry%20pieces%20including%20layered%20necklaces%20thin%20bracelets%20delicate%20anklets%20and%20stacking%20rings%20arranged%20in%20an%20artistic%20composition%20on%20cream%20silk%20fabric%2C%20warm%20natural%20sunlight%20casting%20soft%20golden%20highlights%2C%20scattered%20jasmine%20and%20rose%20petals%2C%20elegant%20Egyptian%20jewelry%20brand%20editorial%2C%20premium%20product%20photography%2C%20soft%20warm%20beige%20and%20gold%20tones%2C%20clean%20composition%20with%20ample%20negative%20space%2C%20sophisticated%20artisan%20craft%20aesthetic%2C%20magazine%20spread%20quality&width=1800&height=600&seq=new-arrivals-banner-home&orientation=landscape"
                    alt="New Arrivals — Sett El Heta"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-black/30" />

                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <motion.span
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="font-heading text-xs tracking-[0.3em] text-gold-300 uppercase mb-4"
                    >
                      Exclusive First Look
                    </motion.span>
                    <motion.h2
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="font-heading font-black text-2xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight"
                      style={{ textShadow: '0 2px 30px rgba(0,0,0,0.4)' }}
                    >
                      The Latest Collection<br />Has Arrived
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.55 }}
                      className="font-body text-sm md:text-base text-white/80 max-w-md mb-8 leading-relaxed"
                      style={{ textShadow: '0 1px 15px rgba(0,0,0,0.4)' }}
                    >
                      Be the first to discover our newest designs — fresh from the artisan's bench to your collection
                    </motion.p>
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.65 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-heading font-bold text-sm text-white border-2 border-white/40 hover:border-white/70 hover:bg-white/10 transition-all duration-500 whitespace-nowrap cursor-pointer"
                    >
                      Explore New Arrivals
                      <i className="ri-arrow-right-line"></i>
                    </motion.span>
                  </div>
                </div>
              </Link>
            </ScaleReveal>

            {/* Product teaser row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-8">
              {[
                {
                  name: 'Lotus Dream Necklace',
                  price: '1,850',
                  img: 'https://readdy.ai/api/search-image?query=Delicate%20gold%20plated%20lotus%20pendant%20necklace%20with%20fine%20chain%20displayed%20on%20cream%20marble%2C%20warm%20natural%20sunlight%2C%20luxury%20artisan%20jewelry%20photography%2C%20elegant%20minimal%20composition%2C%20soft%20beige%20background%2C%20shallow%20depth%20of%20field%20highlighting%20the%20lotus%20pendant%20detail%2C%20editorial%20quality%20product%20shot&width=400&height=400&seq=new-arrival-teaser-1&orientation=squarish',
                },
                {
                  name: 'Nile Breeze Anklet',
                  price: '950',
                  img: 'https://readdy.ai/api/search-image?query=Delicate%20thin%20gold%20anklet%20with%20small%20wave%20charm%20displayed%20on%20soft%20cream%20linen%20fabric%2C%20warm%20natural%20sunlight%2C%20luxury%20artisan%20jewelry%20photography%2C%20elegant%20minimal%20composition%2C%20soft%20beige%20tones%2C%20editorial%20product%20shot%20with%20beautiful%20lighting&width=400&height=400&seq=new-arrival-teaser-2&orientation=squarish',
                },
                {
                  name: 'Khan Stack Rings Set',
                  price: '1,250',
                  img: 'https://readdy.ai/api/search-image?query=Set%20of%20three%20thin%20gold%20stacking%20rings%20with%20delicate%20engraved%20patterns%20displayed%20together%20on%20cream%20marble%2C%20warm%20natural%20sunlight%2C%20luxury%20artisan%20jewelry%20photography%2C%20elegant%20minimal%20composition%2C%20soft%20warm%20tones%2C%20editorial%20quality%20product%20shot&width=400&height=400&seq=new-arrival-teaser-3&orientation=squarish',
                },
                {
                  name: 'Cairo Nights Earrings',
                  price: '1,100',
                  img: 'https://readdy.ai/api/search-image?query=Pair%20of%20elegant%20gold%20drop%20earrings%20with%20subtle%20crystal%20details%20displayed%20on%20cream%20marble%2C%20warm%20natural%20sunlight%2C%20luxury%20artisan%20jewelry%20photography%2C%20elegant%20minimal%20composition%2C%20soft%20beige%20and%20gold%20tones%2C%20editorial%20quality%20product%20shot&width=400&height=400&seq=new-arrival-teaser-4&orientation=squarish',
                },
              ].map((item, i) => (
                <SpringReveal key={item.name} delay={0.25 + i * 0.08} dir="up" distance={30}>
                  <Link
                    to="/products?sort=newest"
                    className="group block rounded-2xl overflow-hidden bg-cream-50 border border-cream-200 hover:border-gold-200 transition-all duration-500 cursor-pointer"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 md:p-4 text-center">
                      <p className="font-heading font-bold text-sm md:text-base text-espresso-900 group-hover:text-gold-600 transition-colors">{item.name}</p>
                      <p className="font-heading font-black text-sm text-gold-600 mt-1">{item.price} EGP</p>
                    </div>
                  </Link>
                </SpringReveal>
              ))}
            </div>

            <Reveal delay={0.5} dir="up" distance={16}>
              <div className="text-center mt-10">
                <Link to="/products?sort=newest" className="inline-flex items-center gap-2 font-heading font-semibold text-sm text-espresso-700 hover:text-gold-600 transition-colors group">
                  View All New Arrivals
                  <motion.i
                    whileHover={{ x: 3 }}
                    className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform duration-300"
                  ></motion.i>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════ CONNECT — NEWSLETTER + WHATSAPP ══════════════════ */}
      <section className="relative py-24 md:py-36 bg-white overflow-hidden">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeader
              label="Stay Connected"
              title="Be the First to Know"
              description="Subscribe to our newsletter for new arrivals — exclusive collections, special offers, and behind-the-scenes stories"
            />

            {/* Form — input from left, button from right, meet in middle */}
            <div className="max-w-md mx-auto mb-12">
              <form
                data-readdy-form
                action={NEWSLETTER_FORM_URL}
                method="POST"
                className="flex flex-col sm:flex-row items-center gap-3"
              >
                <Reveal dir="left" distance={50} duration={0.6} className="flex-1 w-full">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your email address"
                    className="w-full px-6 py-4 rounded-full font-body text-sm text-espresso-900 bg-cream-50 border-2 border-cream-200 focus:border-gold-300 focus:bg-white outline-none transition-all duration-300 placeholder:text-espresso-400 text-right"
                  />
                </Reveal>
                <input
                  type="text"
                  name="phone_alt"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  readOnly
                  className="absolute opacity-0 pointer-events-none"
                  style={{ position: 'absolute', left: '-9999px' }}
                />
                <Reveal dir="right" distance={50} duration={0.6} delay={0.1}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 rounded-full font-heading font-bold text-sm text-white bg-espresso-900 hover:bg-espresso-800 transition-colors duration-300 whitespace-nowrap cursor-pointer"
                  >
                    Subscribe Now
                  </motion.button>
                </Reveal>
              </form>
            </div>

            {/* Separator with line draw */}
            <Reveal dir="none" duration={0.5} delay={0.3}>
              <div className="flex items-center gap-6 max-w-sm mx-auto mb-8">
                <LineDraw width="flex-1" color="bg-cream-300" delay={0.35} />
                <span className="font-heading text-xs text-espresso-400 whitespace-nowrap">or</span>
                <LineDraw width="flex-1" color="bg-cream-300" delay={0.35} />
              </div>
            </Reveal>

            {/* WhatsApp — pop-in */}
            <SpringReveal delay={0.45} dir="up" distance={30}>
              <p className="font-body text-sm text-espresso-400 mb-5">Prefer to chat directly?</p>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="https://wa.me/201012345678?text=Hello%20Sett%20El%20Heta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-heading font-bold text-sm text-white transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
              >
                <i className="ri-whatsapp-line text-lg"></i>
                Chat on WhatsApp
              </motion.a>
            </SpringReveal>
          </div>
        </div>
      </section>

    </MainLayout>
  );
}