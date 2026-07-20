import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import JsonLd from '@/components/feature/JsonLd';

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://settelhetta.com';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  author: string;
  published_at: string;
};

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    setError(false);
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image_url, author, published_at')
        .eq('status', 'PUBLISHED')
        .order('published_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-50" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': `${siteUrl}/blog#blog`,
        'name': 'مدونة ست الحتة | عالم الإكسسوارات اليدوية',
        'description': 'اكتشفي أحدث المقالات عن عالم الإكسسوارات اليدوية، نصائح التنسيق، العناية بالمجوهرات، وقصص من ورشة خان الخليلي',
        'url': `${siteUrl}/blog`,
        'blogPost': posts.map((post) => ({
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': post.excerpt,
          'url': `${siteUrl}/blog/${post.slug}`,
          'author': {
            '@type': 'Person',
            'name': post.author,
          },
          'datePublished': post.published_at,
          'image': post.cover_image_url || undefined,
        })),
        'isPartOf': {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
        },
      }} />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=Elegant%20minimalist%20blog%20workspace%20with%20warm%20sand%20beige%20background%2C%20soft%20natural%20light%20streaming%20through%20linen%20curtains%2C%20delicate%20gold%20jewelry%20pieces%20arranged%20on%20marble%20surface%2C%20editorial%20photography%20style%2C%20harmonious%20warm%20neutral%20tones%2C%20artistic%20composition%20with%20generous%20negative%20space%20for%20text%20overlay&width=1600&height=600&seq=blog-hero-cover&orientation=landscape"
            alt="Blog"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-espresso-900/60 via-espresso-900/40 to-background-50" />
        </div>

        <div className="relative z-10 section-padding text-center max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-sm tracking-[0.25em] text-gold-300 uppercase mb-4"
          >
            {t('blog.heroLabel')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-black text-3xl md:text-5xl text-white mb-4"
          >
            {t('blog.heroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-base md:text-lg text-cream-200/80 leading-relaxed"
          >
            {t('blog.heroSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding pb-20 md:pb-28">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-background-50 rounded-2xl overflow-hidden border border-background-200/60 animate-pulse">
                <div className="aspect-[16/10] bg-background-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-background-200 rounded w-1/4" />
                  <div className="h-6 bg-background-200 rounded w-3/4" />
                  <div className="h-4 bg-background-200 rounded w-full" />
                  <div className="h-4 bg-background-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
              <i className="ri-error-warning-line text-2xl text-red-400"></i>
            </div>
            <p className="font-body text-espresso-600 mb-4">{t('blog.loadError')}</p>
            <button
              onClick={loadPosts}
              className="px-6 py-3 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors cursor-pointer"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-cream-100 flex items-center justify-center">
              <i className="ri-article-line text-2xl text-espresso-400"></i>
            </div>
            <p className="font-heading font-semibold text-lg text-espresso-700 mb-2">{t('blog.noPosts')}</p>
            <p className="font-body text-sm text-espresso-500">{t('blog.noPostsHint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-background-200/60 hover:border-gold-300/40 transition-all duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-background-100">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-100 to-cream-200">
                        <i className="ri-article-line text-4xl text-espresso-300"></i>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-body text-xs text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                        {post.author}
                      </span>
                      <span className="font-body text-xs text-espresso-400">
                        {new Date(post.published_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-espresso-900 mb-2 group-hover:text-gold-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-body text-sm text-espresso-500 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-gold-600 font-heading font-semibold text-sm">
                      <span>{t('blog.readMore')}</span>
                      {isRtl ? (
                        <i className="ri-arrow-left-line text-sm transition-transform group-hover:-translate-x-1"></i>
                      ) : (
                        <i className="ri-arrow-right-line text-sm transition-transform group-hover:translate-x-1"></i>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}