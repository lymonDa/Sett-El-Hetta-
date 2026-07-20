import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  content: string;
  cover_image_url: string | null;
  author: string;
  status: string;
};

export default function AdminBlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const admin = useAdminAuthStore((s) => s.admin);
  const isRtl = i18n.language === 'ar';
  const isNew = !id || id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [author, setAuthor] = useState(admin?.name || '');
  const [status, setStatus] = useState<string>('DRAFT');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      loadPost(id);
    }
  }, [id, isNew]);

  async function loadPost(postId: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error || !data) {
        setNotFound(true);
        return;
      }

      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || '');
      setContent(data.content || '');
      setCoverImageUrl(data.cover_image_url || '');
      setAuthor(data.author || '');
      setStatus(data.status);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleSave() {
    if (!admin?.id || !title.trim()) return;
    setSaving(true);
    setSuccessMsg('');

    const finalSlug = slug.trim() || generateSlug(title);

    try {
      const action = isNew ? 'create_blog_post' : 'update_blog_post';
      const body: Record<string, unknown> = {
        action,
        adminId: admin.id,
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content,
        coverImageUrl: coverImageUrl || null,
        author: author.trim(),
        status,
      };

      if (!isNew) {
        body.postId = id;
      }

      const { data, error } = await supabase.functions.invoke('admin-operations', {
        body,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSuccessMsg(isNew ? t('admin.blogEdit.created') : t('admin.blogEdit.saved'));

      if (isNew && data?.post?.id) {
        // Navigate to edit page for the newly created post
        setTimeout(() => {
          navigate(`/admin/blog/${data.post.id}/edit`, { replace: true });
        }, 800);
        return;
      }

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setSuccessMsg('');
    } finally {
      setSaving(false);
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !admin?.id) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'upload_blog_cover',
          adminId: admin.id,
          fileName: file.name,
          fileData,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        setCoverImageUrl(data.url);
      }
    } catch {
      // handled silently
    } finally {
      setUploading(false);
    }
  }

  if (notFound) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="max-w-md mx-auto py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
              <i className="ri-error-warning-line text-2xl text-red-400"></i>
            </div>
            <h1 className="font-heading font-bold text-xl text-espresso-900 mb-3">{t('admin.blogEdit.notFound')}</h1>
            <p className="font-body text-espresso-500 mb-6">{t('admin.blogEdit.notFoundHint')}</p>
            <button
              onClick={() => navigate('/admin/blog')}
              className="px-6 py-3 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors cursor-pointer"
            >
              {t('admin.blogEdit.backToList')}
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="max-w-3xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-cream-100 rounded w-1/3" />
            <div className="h-12 bg-cream-100 rounded w-full" />
            <div className="h-12 bg-cream-100 rounded w-full" />
            <div className="h-40 bg-cream-100 rounded w-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate('/admin/blog')}
                className="inline-flex items-center gap-1.5 font-body text-sm text-gold-600 hover:text-gold-700 transition-colors mb-2 cursor-pointer"
              >
                {isRtl ? (
                  <i className="ri-arrow-right-s-line"></i>
                ) : (
                  <i className="ri-arrow-left-s-line"></i>
                )}
                {t('admin.blogEdit.backToList')}
              </button>
              <h1 className="font-heading font-black text-2xl text-espresso-900">
                {isNew ? t('admin.blogEdit.createTitle') : t('admin.blogEdit.editTitle')}
              </h1>
              <p className="font-body text-sm text-espresso-500 mt-1">
                {isNew ? t('admin.blogEdit.createSubtitle') : t('admin.blogEdit.editSubtitle')}
              </p>
            </div>
          </div>

          {/* Success Message */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 rounded-xl bg-green-50 text-green-700 font-body text-sm border border-green-200"
            >
              <i className="ri-check-line mr-2"></i>{successMsg}
            </motion.div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-heading font-semibold text-sm text-espresso-700 mb-2">
                {t('admin.blogEdit.title')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug.trim() || slug === generateSlug(title)) {
                    setSlug(generateSlug(e.target.value));
                  }
                }}
                placeholder={t('admin.blogEdit.titlePlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>

            {/* Slug + Author row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-heading font-semibold text-sm text-espresso-700 mb-2">
                  {t('admin.blogEdit.slug')}
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
              <div>
                <label className="block font-heading font-semibold text-sm text-espresso-700 mb-2">
                  {t('admin.blogEdit.author')}
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={t('admin.blogEdit.authorPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block font-heading font-semibold text-sm text-espresso-700 mb-2">
                {t('admin.blogEdit.excerpt')}
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder={t('admin.blogEdit.excerptPlaceholder')}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:border-gold-400 transition-colors resize-none"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block font-heading font-semibold text-sm text-espresso-700 mb-2">
                {t('admin.blogEdit.coverImage')}
              </label>
              {coverImageUrl ? (
                <div className="relative rounded-xl overflow-hidden bg-cream-100 aspect-[16/9] mb-3">
                  <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setCoverImageUrl('')}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-cream-300 bg-cream-50 flex flex-col items-center justify-center gap-2 hover:border-gold-300 transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                      <span className="font-body text-sm text-espresso-500">{t('admin.blogEdit.uploading')}</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-image-add-line text-2xl text-espresso-400"></i>
                      <span className="font-body text-sm text-espresso-500">{t('admin.blogEdit.uploadCover')}</span>
                    </>
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleCoverUpload}
                className="hidden"
              />
              {coverImageUrl && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-2 font-body text-sm text-gold-600 hover:text-gold-700 transition-colors cursor-pointer"
                >
                  <i className="ri-refresh-line mr-1"></i>{t('admin.blogEdit.changeCover')}
                </button>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block font-heading font-semibold text-sm text-espresso-700 mb-2">
                {t('admin.blogEdit.content')}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('admin.blogEdit.contentPlaceholder')}
                rows={16}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-espresso-900 placeholder:text-espresso-300 focus:outline-none focus:border-gold-400 transition-colors resize-y font-mono"
              />
              <p className="font-body text-xs text-espresso-400 mt-1">{t('admin.blogEdit.contentHint')}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block font-heading font-semibold text-sm text-espresso-700 mb-2">
                {t('admin.blogEdit.status')}
              </label>
              <div className="flex gap-2">
                {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-5 py-2.5 rounded-xl font-heading font-semibold text-sm transition-all cursor-pointer ${
                      status === s
                        ? s === 'PUBLISHED'
                          ? 'bg-green-500 text-white'
                          : 'bg-cream-200 text-espresso-700'
                        : 'bg-white border border-cream-300 text-espresso-500 hover:border-gold-300'
                    }`}
                  >
                    {t(`admin.blog.status.${s.toLowerCase()}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center gap-3 pt-4 border-t border-cream-200">
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="px-6 py-3 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {saving ? t('admin.blogEdit.saving') : isNew ? t('admin.blogEdit.create') : t('admin.blogEdit.save')}
              </button>
              <button
                onClick={() => navigate('/admin/blog')}
                className="px-6 py-3 rounded-xl border border-cream-300 text-espresso-600 font-heading font-semibold text-sm hover:bg-cream-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}