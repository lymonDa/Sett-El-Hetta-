import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  content: string;
  cover_image_url: string | null;
  author: string;
  published_at: string;
};

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  author: string;
  published_at: string;
};

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) loadPost(slug);
  }, [slug]);

  async function loadPost(postSlug: string) {
    setLoading(true);
    setError(false);
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('status', 'PUBLISHED')
        .single();

      if (fetchError) throw fetchError;
      setPost(data);

      // Fetch related posts
      const { data: related, error: relatedError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image_url, author, published_at')
        .eq('status', 'PUBLISHED')
        .neq('id', data.id)
        .order('published_at', { ascending: false })
        .limit(3);

      if (!relatedError && related) {
        setRelatedPosts(related);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const formattedDate = post
    ? new Date(post.published_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-background-50" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />

      {loading ? (
        <div className="pt-32 pb-20 section-padding">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-5 bg-background-200 rounded w-1/3 mb-4" />
            <div className="h-10 bg-background-200 rounded w-3/4 mb-6" />
            <div className="h-6 bg-background-200 rounded w-1/4 mb-8" />
            <div className="aspect-[16/9] bg-background-200 rounded-2xl mb-10" />
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-background-200 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      ) : error || !post ? (
        <div className="pt-32 pb-20 section-padding text-center">
          <div className="max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
              <i className="ri-error-warning-line text-3xl text-red-400"></i>
            </div>
            <h1 className="font-heading font-bold text-2xl text-espresso-900 mb-3">{t('blog.notFound')}</h1>
            <p className="font-body text-espresso-500 mb-6">{t('blog.notFoundHint')}</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors"
            >
              <i className={`ri-arrow-${isRtl ? 'right' : 'left'}-line`}></i>
              {t('blog.backToBlog')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <JsonLd data={{
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${siteUrl}/blog/${post.slug}#article`,
            'headline': post.title,
            'description': post.excerpt,
            'url': `${siteUrl}/blog/${post.slug}`,
            'author': {
              '@type': 'Person',
              'name': post.author,
            },
            'datePublished': post.published_at,
            'image': post.cover_image_url || undefined,
            'publisher': {
              '@type': 'Organization',
              '@id': `${siteUrl}/#organization`,
              'name': 'ست الحتة',
            },
            'isPartOf': {
              '@type': 'Blog',
              '@id': `${siteUrl}/blog#blog`,
            },
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': `${siteUrl}/blog/${post.slug}`,
            },
          }} />

          {/* Header */}
          <section className="pt-32 pb-12 md:pt-40 md:pb-16">
            <div className="section-padding max-w-3xl mx-auto">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 font-body text-sm text-gold-600 hover:text-gold-700 transition-colors mb-6"
              >
                {isRtl ? (
                  <i className="ri-arrow-right-line text-sm"></i>
                ) : (
                  <i className="ri-arrow-left-line text-sm"></i>
                )}
                {t('blog.backToBlog')}
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <span className="font-body text-xs text-gold-600 bg-gold-50 px-3 py-1.5 rounded-full">
                  {post.author}
                </span>
                <span className="font-body text-sm text-espresso-400">{formattedDate}</span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-heading font-black text-3xl md:text-4xl text-espresso-900 mb-4 leading-tight"
              >
                {post.title}
              </motion.h1>

              {post.excerpt && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-body text-lg text-espresso-500 leading-relaxed"
                >
                  {post.excerpt}
                </motion.p>
              )}
            </div>
          </section>

          {/* Cover Image */}
          {post.cover_image_url && (
            <section className="section-padding pb-12">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="aspect-[16/9] rounded-2xl overflow-hidden bg-background-100"
                >
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>
              </div>
            </section>
          )}

          {/* Content */}
          <section className="section-padding pb-20 md:pb-28">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="prose prose-espresso max-w-none font-body text-espresso-700 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </section>

          {/* Share / CTA */}
          <section className="section-padding pb-16 md:pb-20">
            <div className="max-w-3xl mx-auto">
              <div className="bg-cream-50 rounded-2xl p-8 md:p-10 text-center border border-cream-200/60">
                <h3 className="font-heading font-bold text-xl text-espresso-900 mb-3">{t('blog.ctaTitle')}</h3>
                <p className="font-body text-espresso-500 mb-6">{t('blog.ctaSubtitle')}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors whitespace-nowrap"
                  >
                    {t('blog.ctaBrowse')}
                  </Link>
                  <a
                    href="https://wa.me/201012345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-green-200 text-green-700 font-heading font-semibold text-sm hover:bg-green-50 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-whatsapp-line"></i>
                    {t('blog.ctaWhatsApp')}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="section-padding pb-20 md:pb-28">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <p className="font-body text-xs tracking-[0.2em] text-gold-500 uppercase mb-2">
                    {isRtl ? 'استمر في القراءة' : 'Keep Reading'}
                  </p>
                  <h3 className="font-heading font-bold text-2xl md:text-3xl text-espresso-900">
                    {isRtl ? 'مقالات قد تعجبك أيضاً' : 'You May Also Like'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((rp, i) => (
                    <motion.article
                      key={rp.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Link
                        to={`/blog/${rp.slug}`}
                        className="group block bg-white rounded-2xl overflow-hidden border border-background-200/60 hover:border-gold-300/40 transition-all duration-300"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-background-100">
                          {rp.cover_image_url ? (
                            <img
                              src={rp.cover_image_url}
                              alt={rp.title}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-100 to-cream-200">
                              <i className="ri-article-line text-3xl text-espresso-300"></i>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-body text-xs text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">
                              {rp.author}
                            </span>
                            <span className="font-body text-xs text-espresso-400">
                              {new Date(rp.published_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <h4 className="font-heading font-semibold text-sm text-espresso-900 group-hover:text-gold-700 transition-colors line-clamp-2 mb-1.5">
                            {rp.title}
                          </h4>
                          <p className="font-body text-xs text-espresso-500 leading-relaxed line-clamp-2">
                            {rp.excerpt}
                          </p>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm text-gold-600 hover:text-gold-700 transition-colors"
                  >
                    {isRtl ? 'عرض كل المقالات' : 'View All Posts'}
                    {isRtl ? (
                      <i className="ri-arrow-left-line text-sm"></i>
                    ) : (
                      <i className="ri-arrow-right-line text-sm"></i>
                    )}
                  </Link>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}