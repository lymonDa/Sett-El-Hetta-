import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  author: string;
  status: string;
  published_at: string | null;
  created_at: string;
};

export default function AdminBlogPage() {
  const { t, i18n } = useTranslation();
  const admin = useAdminAuthStore((s) => s.admin);
  const isRtl = i18n.language === 'ar';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    setError(false);
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || !admin?.id) return;
    setDeleting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'delete_blog_post',
          postId: deleteTarget.id,
          adminId: admin.id,
        },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // handled silently
    } finally {
      setDeleting(false);
    }
  }

  const filtered = statusFilter === 'all'
    ? posts
    : posts.filter((p) => p.status === statusFilter);

  const statusCounts = {
    all: posts.length,
    PUBLISHED: posts.filter((p) => p.status === 'PUBLISHED').length,
    DRAFT: posts.filter((p) => p.status === 'DRAFT').length,
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-black text-2xl md:text-3xl text-espresso-900">
              {t('admin.blog.title')}
            </h1>
            <p className="font-body text-sm text-espresso-500 mt-1">
              {t('admin.blog.subtitle', { count: posts.length })}
            </p>
          </div>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            {t('admin.blog.newPost')}
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(['all', 'PUBLISHED', 'DRAFT'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full font-heading font-medium text-sm transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-gold-500 text-white'
                  : 'bg-white text-espresso-600 border border-cream-200 hover:border-gold-300'
              }`}
            >
              {status === 'all' ? t('admin.blog.allPosts') : t(`admin.blog.status.${status.toLowerCase()}`)}
              <span className={`ml-1.5 text-xs ${statusFilter === status ? 'text-white/70' : 'text-espresso-400'}`}>
                ({statusCounts[status]})
              </span>
            </button>
          ))}
        </div>

        {/* Post List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-cream-200 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-16 bg-cream-100 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-cream-100 rounded w-1/3" />
                    <div className="h-5 bg-cream-100 rounded w-2/3" />
                    <div className="h-3 bg-cream-100 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="font-body text-espresso-600 mb-4">{t('admin.blog.loadError')}</p>
            <button onClick={loadPosts} className="px-5 py-2.5 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors cursor-pointer">
              {t('common.retry')}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-cream-200">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cream-100 flex items-center justify-center">
              <i className="ri-article-line text-xl text-espresso-400"></i>
            </div>
            <p className="font-heading font-semibold text-espresso-700 mb-1">{t('admin.blog.noPosts')}</p>
            <p className="font-body text-sm text-espresso-500 mb-4">{t('admin.blog.noPostsHint')}</p>
            <Link
              to="/admin/blog/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors"
            >
              <i className="ri-add-line"></i>
              {t('admin.blog.newPost')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-cream-200 p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-start"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                  {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ri-image-line text-2xl text-espresso-300"></i>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full font-body text-xs font-medium ${
                      post.status === 'PUBLISHED'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-cream-100 text-espresso-500'
                    }`}>
                      {t(`admin.blog.status.${post.status.toLowerCase()}`)}
                    </span>
                    {post.author && (
                      <span className="font-body text-xs text-espresso-400">{post.author}</span>
                    )}
                    {post.published_at && (
                      <span className="font-body text-xs text-espresso-400">
                        {new Date(post.published_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-espresso-900 truncate mb-0.5">{post.title}</h3>
                  <p className="font-body text-sm text-espresso-500 truncate">{post.excerpt}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    to={`/admin/blog/${post.id}/edit`}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-cream-300 text-espresso-500 hover:text-gold-600 hover:border-gold-300 transition-colors cursor-pointer"
                    title={t('common.edit')}
                  >
                    <i className="ri-pencil-line"></i>
                  </Link>
                  {post.status === 'PUBLISHED' && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-cream-300 text-espresso-500 hover:text-gold-600 hover:border-gold-300 transition-colors cursor-pointer"
                      title={t('admin.blog.viewLive')}
                    >
                      <i className="ri-external-link-line"></i>
                    </a>
                  )}
                  <button
                    onClick={() => setDeleteTarget(post)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-cream-300 text-espresso-400 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                    title={t('common.delete')}
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl border border-cream-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading font-bold text-lg text-espresso-900 mb-2">{t('admin.blog.deleteTitle')}</h3>
            <p className="font-body text-sm text-espresso-500 mb-6">
              {t('admin.blog.deleteConfirm', { title: deleteTarget.title })}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl border border-cream-300 text-espresso-600 font-heading font-semibold text-sm hover:bg-cream-50 transition-colors cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-heading font-semibold text-sm hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60"
              >
                {deleting ? t('admin.blog.deleting') : t('common.delete')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}