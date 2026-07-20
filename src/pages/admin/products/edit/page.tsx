import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductBySlug, fetchCategories, transformCategory, uploadProductImage, deleteProductImage, reorderProductImages, type DbCategory } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { Category, Product } from '@/types';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useTranslation } from 'react-i18next';

interface MediaItem {
  id: string;
  url: string;
  sortOrder: number;
}

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { admin } = useAdminAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNew = !id || id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    slug: '',
    description: '',
    material: '',
    dimensions: '',
    price: '',
    stockQty: '',
    categoryId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'RETIRED',
    isBundle: false,
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await fetchCategories();
        setCategories((cats as unknown as Record<string, unknown>[]).map((c) => transformCategory(c as DbCategory)));
      } catch {
        // silent
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (isNew) return;
    async function loadProduct() {
      setLoading(true);
      try {
        const { data, error: pgError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (pgError || !data) {
          setError(t('admin.productEdit.notFound'));
          return;
        }

        const product = data as Record<string, unknown>;

        setForm({
          name: (product.name as string) || '',
          sku: (product.sku as string) || '',
          slug: (product.slug as string) || '',
          description: (product.description as string) || '',
          material: (product.material as string) || '',
          dimensions: (product.dimensions as string) || '',
          price: (product.price as number)?.toString() || '',
          stockQty: (product.stock_qty as number)?.toString() || '0',
          categoryId: (product.category_id as string) || '',
          status: (product.status as 'ACTIVE' | 'RETIRED') || 'ACTIVE',
          isBundle: (product.is_bundle as boolean) || false,
        });

        const { data: media } = await supabase
          .from('product_media')
          .select('id, url, sort_order')
          .eq('product_id', id)
          .order('sort_order');

        setMediaItems((media as { id: string; url: string; sort_order: number }[])?.map((m) => ({
          id: m.id,
          url: m.url,
          sortOrder: m.sort_order,
        })) || []);
        setExistingProduct(product as unknown as Product);
      } catch {
        setError(t('admin.loadError'));
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, isNew, t]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80);
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.categoryId) {
      setError(t('admin.productEdit.requiredFields'));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: isNew ? 'create_product' : 'update_product',
          productId: isNew ? undefined : id,
          adminId: admin?.id,
          name: form.name.trim(),
          sku: form.sku.trim() || undefined,
          slug: form.slug.trim() || generateSlug(form.name),
          description: form.description.trim(),
          material: form.material.trim(),
          dimensions: form.dimensions.trim(),
          price: parseFloat(form.price),
          stockQty: parseInt(form.stockQty) || 0,
          categoryId: form.categoryId,
          status: form.status,
          isBundle: form.isBundle,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setSuccessMsg(isNew ? t('admin.productEdit.created') : t('admin.productEdit.saved'));
      setExistingProduct(data?.product as unknown as Product);

      if (isNew && data?.product) {
        const newId = (data.product as { id: string }).id;
        setTimeout(() => navigate(`/admin/products/${newId}/edit`), 1500);
      }
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!admin?.id) return;

    const productId = existingProduct?.id || id;
    if (!productId) {
      setError(t('admin.productEdit.saveBeforeUpload'));
      return;
    }

    const validFiles = Array.from(files).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(f.type)
    );

    if (validFiles.length === 0) {
      setError(t('admin.productEdit.invalidImageType'));
      return;
    }

    setUploading(true);
    setError(null);

    for (const file of validFiles) {
      try {
        const media = await uploadProductImage(productId, admin.id, file);
        setMediaItems((prev) => [...prev, { id: media.id, url: media.url, sortOrder: media.sort_order }]);
      } catch (err) {
        setError(t('admin.productEdit.uploadFailed'));
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteImage = async (mediaId: string) => {
    if (!admin?.id) return;
    setDeletingId(mediaId);
    try {
      await deleteProductImage(mediaId, admin.id);
      setMediaItems((prev) => prev.filter((m) => m.id !== mediaId));
      setDeleteConfirmId(null);
    } catch {
      setError(t('admin.productEdit.deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...mediaItems];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    setMediaItems(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Persist order
    const productId = existingProduct?.id || id;
    if (productId && admin?.id) {
      try {
        await reorderProductImages(productId, admin.id, reordered.map((m) => m.id));
      } catch {
        // silent — UI already updated
      }
    }
  };

  const productId = existingProduct?.id || id;

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8">
          <div className="space-y-4 animate-pulse max-w-3xl">
            <div className="h-8 w-48 bg-cream-100 rounded" />
            <div className="h-96 bg-cream-100 rounded-2xl" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !isNew) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8 text-center">
          <h2 className="font-heading font-bold text-xl text-espresso-900 mb-2">{t('admin.orderNotFound')}</h2>
          <p className="font-body text-sm text-red-500 mb-4">{error}</p>
          <Link to="/admin/products" className="btn-primary inline-block">{t('admin.backToOrders')}</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Link to="/admin/products" className="w-9 h-9 flex items-center justify-center rounded-xl border border-cream-300 hover:bg-cream-50 transition-colors cursor-pointer shrink-0">
            <i className={`${isRtl ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-espresso-700 text-lg`}></i>
          </Link>
          <div>
            <h1 className="font-heading font-bold text-lg md:text-2xl text-espresso-900">
              {isNew ? t('admin.newProduct') : `${t('admin.edit')}: ${existingProduct?.name || form.name}`}
            </h1>
            <p className="font-body text-xs md:text-sm text-espresso-500 mt-1">{isNew ? t('admin.productEdit.createSubtitle') : t('admin.productEdit.editSubtitle')}</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 text-green-700 text-sm font-body flex items-center gap-2 border border-green-200">
            <i className="ri-checkbox-circle-line"></i>{successMsg}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-body flex items-center gap-2 border border-red-200">
            <i className="ri-error-warning-line"></i>{error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-cream-200 p-5">
              <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.productEdit.basicInfo')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.productEdit.name')} *</label>
                  <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white" placeholder="اسم المنتج" />
                </div>
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">SKU</label>
                  <input type="text" value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white" placeholder="SEH-XXX" dir="ltr" />
                </div>
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white" placeholder="product-slug" dir="ltr" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.productEdit.description')}</label>
                  <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white resize-none" rows={3} placeholder={t('admin.productEdit.descriptionPlaceholder')} maxLength={2000} />
                  <p className="font-body text-xs text-espresso-500 mt-1 text-right">{form.description.length}/2000</p>
                </div>
              </div>
            </div>

            {/* Image Manager */}
            {productId && (
              <div className="bg-white rounded-2xl border border-cream-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-base text-espresso-900">{t('admin.productEdit.images')}</h3>
                  <span className="font-body text-xs text-espresso-500">{mediaItems.length} {t('admin.productEdit.images')}</span>
                </div>

                {/* Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`mb-4 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${uploading ? 'border-gold-300 bg-gold-50/50 opacity-60' : 'border-cream-300 hover:border-gold-400 hover:bg-cream-50'}`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <i className="ri-loader-4-line animate-spin text-2xl text-gold-500"></i>
                      <p className="font-body text-sm text-espresso-500">{t('admin.productEdit.uploading')}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cream-100">
                        <i className="ri-image-add-line text-xl text-gold-500"></i>
                      </div>
                      <p className="font-heading font-semibold text-sm text-espresso-700">{t('admin.productEdit.uploadHint')}</p>
                      <p className="font-body text-xs text-espresso-500">{t('admin.productEdit.uploadFormats')}</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Image Grid */}
                {mediaItems.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {mediaItems.map((item, index) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`relative group aspect-square rounded-xl overflow-hidden bg-cream-50 border-2 transition-all cursor-grab active:cursor-grabbing ${draggedIndex === index ? 'opacity-40 scale-95' : 'opacity-100'} ${dragOverIndex === index && draggedIndex !== index ? 'border-gold-400 bg-gold-50/50' : 'border-cream-200'}`}
                      >
                        <img src={item.url} alt={`${form.name} ${index + 1}`} className="w-full h-full object-cover" />
                        {/* Sort badge */}
                        <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 text-white font-heading text-xs font-bold pointer-events-none">
                          {index + 1}
                        </div>
                        {/* Delete button */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }}
                            disabled={deletingId === item.id}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer"
                          >
                            {deletingId === item.id ? (
                              <i className="ri-loader-4-line animate-spin text-xs"></i>
                            ) : (
                              <i className="ri-delete-bin-line text-sm"></i>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-cream-100">
                      <i className="ri-image-line text-2xl text-espresso-400"></i>
                    </div>
                    <p className="font-body text-sm text-espresso-500">{t('admin.productEdit.noImages')}</p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-cream-200 p-5">
              <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.productEdit.details')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.productEdit.material')}</label>
                  <input type="text" value={form.material} onChange={(e) => handleChange('material', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white" placeholder="ذهب عيار 18, ستانلس ستيل..." />
                </div>
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.productEdit.dimensions')}</label>
                  <input type="text" value={form.dimensions} onChange={(e) => handleChange('dimensions', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white" placeholder="20سم × 2سم" />
                </div>
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.productEdit.price')} *</label>
                  <input type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white" placeholder="0.00" min="0" step="0.01" />
                </div>
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.productEdit.stockQty')}</label>
                  <input type="number" value={form.stockQty} onChange={(e) => handleChange('stockQty', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white" placeholder="0" min="0" step="1" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-cream-200 p-5">
              <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.productEdit.settings')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.productEdit.category')} *</label>
                  <select value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-cream-300 font-body text-sm bg-white focus:outline-none focus:border-gold-400 text-espresso-900 cursor-pointer">
                    <option value="">{t('admin.productEdit.selectCategory')}</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.productEdit.status')}</label>
                  <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-cream-300 font-body text-sm bg-white focus:outline-none focus:border-gold-400 text-espresso-900 cursor-pointer">
                    <option value="ACTIVE">{t('admin.statusFilter.active')}</option>
                    <option value="RETIRED">{t('admin.statusFilter.retired')}</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <input type="checkbox" id="isBundle" checked={form.isBundle} onChange={(e) => handleChange('isBundle', e.target.checked)} className="w-4 h-4 rounded border-cream-300 text-gold-500 focus:ring-gold-400 cursor-pointer" />
                  <label htmlFor="isBundle" className="font-body text-sm text-espresso-900 cursor-pointer">{t('admin.productEdit.isBundle')}</label>
                </div>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 disabled:opacity-50 transition-colors cursor-pointer">
              {saving ? <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin"></i>{t('admin.productEdit.saving')}</span> : isNew ? t('admin.productEdit.createProduct') : t('admin.productEdit.saveChanges')}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-cream-200">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-red-50">
              <i className="ri-delete-bin-line text-xl text-red-500"></i>
            </div>
            <h3 className="font-heading font-bold text-lg text-espresso-900 text-center mb-1">{t('admin.productEdit.deleteImageTitle')}</h3>
            <p className="font-body text-sm text-espresso-500 text-center mb-6">{t('admin.productEdit.deleteImageConfirm')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteImage(deleteConfirmId)}
                disabled={deletingId === deleteConfirmId}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-heading font-medium text-sm hover:bg-red-600 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {deletingId === deleteConfirmId ? (
                  <span className="flex items-center justify-center gap-1"><i className="ri-loader-4-line animate-spin"></i>{t('admin.productEdit.deleting')}</span>
                ) : t('admin.productEdit.confirmDelete')}
              </button>
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-cream-300 font-heading font-medium text-sm text-espresso-700 hover:bg-cream-50 transition-colors cursor-pointer">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}