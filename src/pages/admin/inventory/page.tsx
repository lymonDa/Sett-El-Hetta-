import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchProducts, transformCategory, transformProduct } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useTranslation } from 'react-i18next';

export default function AdminInventoryPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const locale = isRtl ? 'ar-EG' : 'en-US';
  const { admin } = useAdminAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');

  const [adjustModal, setAdjustModal] = useState<{ product: Product; type: 'add' | 'remove' } | null>(null);
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [dbCategories, { products: dbProducts, media }] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        setCategories(dbCategories.map((cat: Record<string, unknown>) => transformCategory(cat)));
        setProducts(dbProducts.map((p: Record<string, unknown>, i: number) => transformProduct(p, media[p.id as string] || [], i)));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = products.filter((p) => {
    if (filterCategory !== 'all' && p.categoryId !== filterCategory) return false;
    if (filterStock === 'out' && p.stockQty !== 0) return false;
    if (filterStock === 'low' && (p.stockQty === 0 || p.stockQty > 5)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalStock = products.reduce((sum, p) => sum + p.stockQty, 0);
  const lowStockCount = products.filter((p) => p.stockQty > 0 && p.stockQty <= 5).length;
  const outOfStockCount = products.filter((p) => p.stockQty === 0).length;

  const handleAdjust = async () => {
    if (!admin || !adjustModal || adjustQty < 1) return;
    setIsAdjusting(true);
    setAdjustError(null);

    try {
      const change = adjustModal.type === 'add' ? adjustQty : -adjustQty;
      const { error: invError } = await supabase.from('inventory_logs').insert({
        product_id: adjustModal.product.id,
        change,
        reason: adjustReason.trim() || (adjustModal.type === 'add' ? 'Manual stock addition' : 'Manual stock deduction'),
        admin_id: admin.id,
      });

      if (invError) throw invError;

      const { error: rpcError } = await supabase.rpc(
        adjustModal.type === 'add' ? 'increment_stock' : 'decrement_stock',
        { p_product_id: adjustModal.product.id, p_quantity: adjustQty }
      );

      if (rpcError) throw rpcError;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === adjustModal.product.id
            ? { ...p, stockQty: p.stockQty + change }
            : p
        )
      );

      setAdjustModal(null);
      setAdjustQty(1);
      setAdjustReason('');
      setSuccessMsg(t('admin.inventory.adjusted', { name: adjustModal.product.name, qty: adjustQty }));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setAdjustError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setIsAdjusting(false);
    }
  };

  const stockLabel = (qty: number) => {
    if (qty === 0) return { text: t('admin.inventory.outOfStock'), cls: 'text-red-700 bg-red-50 border border-red-200' };
    if (qty <= 5) return { text: t('admin.lowStock', { count: 1 }), cls: 'text-gold-700 bg-gold-50 border border-gold-200' };
    return { text: t('admin.inventory.inStock'), cls: 'text-green-700 bg-green-50 border border-green-200' };
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-6">
          <div>
            <h1 className="font-heading font-bold text-xl md:text-2xl text-espresso-900">{t('admin.navInventory')}</h1>
            <p className="font-body text-xs md:text-sm text-espresso-500 mt-1">{t('admin.inventory.subtitle', { total: totalStock })}</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm font-body flex items-center gap-2 border border-green-200">
            <i className="ri-checkbox-circle-line"></i>{successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white border border-cream-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-50">
                <i className="ri-stack-line text-green-600"></i>
              </div>
              <p className="font-body text-sm text-espresso-500">{t('admin.inventory.totalStock')}</p>
            </div>
            <p className="font-heading font-bold text-2xl text-espresso-900">{totalStock}</p>
          </div>

          <div className={`p-4 rounded-2xl border cursor-pointer transition-all ${filterStock === 'low' ? 'border-gold-400 bg-gold-50' : 'border-cream-200 bg-white hover:border-cream-400'}`} onClick={() => setFilterStock(filterStock === 'low' ? 'all' : 'low')}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gold-50">
                <i className="ri-alarm-warning-line text-gold-600"></i>
              </div>
              <p className="font-body text-sm text-espresso-500">{t('admin.inventory.lowStockLabel')}</p>
            </div>
            <p className="font-heading font-bold text-2xl text-espresso-900">{lowStockCount}</p>
          </div>

          <div className={`p-4 rounded-2xl border cursor-pointer transition-all ${filterStock === 'out' ? 'border-red-400 bg-red-50' : 'border-cream-200 bg-white hover:border-cream-400'}`} onClick={() => setFilterStock(filterStock === 'out' ? 'all' : 'out')}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50">
                <i className="ri-error-warning-line text-red-600"></i>
              </div>
              <p className="font-body text-sm text-espresso-500">{t('admin.inventory.outOfStockLabel')}</p>
            </div>
            <p className="font-heading font-bold text-2xl text-espresso-900">{outOfStockCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-cream-200 p-3 md:p-4 mb-5 md:mb-6 flex flex-col sm:flex-row gap-2 md:gap-3">
          <div className="relative flex-1">
            <i className="ri-search-line absolute top-1/2 -translate-y-1/2 text-espresso-400 text-sm" style={isRtl ? { right: '0.75rem' } : { left: '0.75rem' }}></i>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.searchProductPlaceholder')} className="w-full py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white" style={isRtl ? { paddingRight: '2.25rem', paddingLeft: '1rem' } : { paddingLeft: '2.25rem', paddingRight: '1rem' }} />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2.5 rounded-xl border border-cream-300 font-body text-xs md:text-sm bg-white focus:outline-none focus:border-gold-400 text-espresso-900 cursor-pointer">
            <option value="all">{t('admin.allCategories')}</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-cream-100 animate-pulse rounded-xl" />)}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center">
            <p className="font-body text-sm text-red-500 mb-3">{t('admin.loadError')}</p>
            <button onClick={() => window.location.reload()} className="btn-outline text-sm">{t('common.retry')}</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-cream-200 bg-cream-50">
                    {[t('admin.inventory.colProduct'), t('admin.inventory.colCategory'), t('admin.inventory.colPrice'), t('admin.inventory.colStock'), t('admin.inventory.colStatus'), ''].map((h) => (
                      <th key={h} className="px-4 py-3 font-heading font-semibold text-xs text-espresso-500 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product, index) => {
                    const imageUrl = product.media[0]?.url || '';
                    const cat = categories.find((c) => c.id === product.categoryId);
                    const sl = stockLabel(product.stockQty);
                    return (
                      <tr key={product.id} className={`border-b border-cream-200 hover:bg-cream-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-cream-50/40'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-50 shrink-0">
                              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-heading font-semibold text-sm text-espresso-900">{product.name}</p>
                              <p className="font-body text-xs text-espresso-500">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="font-body text-sm text-espresso-500">{cat?.name || '—'}</span></td>
                        <td className="px-4 py-3"><span className="font-heading font-semibold text-sm text-gold-600">{product.price.toLocaleString(locale)} {t('common.EGP')}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-heading font-semibold ${sl.cls}`}>{sl.text}</span>
                            <span className="font-heading font-bold text-sm text-espresso-900">{product.stockQty}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-heading font-medium ${product.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-cream-100 text-espresso-500 border border-cream-300'}`}>
                            {product.status === 'ACTIVE' ? t('admin.statusFilter.active') : t('admin.statusFilter.retired')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setAdjustModal({ product, type: 'add' })} className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer" title={t('admin.inventory.addStock')}>
                              <i className="ri-add-line text-sm"></i>
                            </button>
                            <button onClick={() => setAdjustModal({ product, type: 'remove' })} disabled={product.stockQty <= 0} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" title={t('admin.inventory.removeStock')}>
                              <i className="ri-subtract-line text-sm"></i>
                            </button>
                            <Link to={`/admin/products/${product.id}/edit`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-cream-300 text-espresso-500 hover:bg-cream-50 transition-colors cursor-pointer" title={t('admin.edit')}>
                              <i className="ri-edit-line text-sm"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adjustModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => { if (!isAdjusting) setAdjustModal(null); }}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-cream-200" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-heading font-bold text-lg text-espresso-900 mb-1">
                {adjustModal.type === 'add' ? t('admin.inventory.addStockTitle') : t('admin.inventory.removeStockTitle')}
              </h3>
              <p className="font-body text-sm text-espresso-500 mb-4">{adjustModal.product.name}</p>

              {adjustError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-body flex items-center gap-2 border border-red-200">
                  <i className="ri-error-warning-line"></i>{adjustError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.inventory.quantity')}</label>
                  <input type="number" value={adjustQty} onChange={(e) => setAdjustQty(Math.max(1, parseInt(e.target.value) || 0))} min={1} max={adjustModal.type === 'remove' ? adjustModal.product.stockQty : 9999} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white" />
                  {adjustModal.type === 'remove' && <p className="font-body text-xs text-espresso-500 mt-1">{t('admin.inventory.currentStock')}: {adjustModal.product.stockQty}</p>}
                </div>
                <div>
                  <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.inventory.reason')}</label>
                  <input type="text" value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 bg-white" placeholder={t('admin.inventory.reasonPlaceholder')} maxLength={200} />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleAdjust} disabled={isAdjusting || adjustQty < 1 || (adjustModal.type === 'remove' && adjustQty > adjustModal.product.stockQty)} className={`flex-1 py-2.5 rounded-xl font-heading font-medium text-sm text-white transition-colors disabled:opacity-50 cursor-pointer ${adjustModal.type === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                  {isAdjusting ? <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin"></i>{t('common.loading')}</span> : adjustModal.type === 'add' ? t('admin.inventory.addStock') : t('admin.inventory.removeStock')}
                </button>
                <button onClick={() => { setAdjustModal(null); setAdjustError(null); }} disabled={isAdjusting} className="px-5 py-2.5 rounded-xl border border-cream-300 font-heading font-medium text-sm text-espresso-700 hover:bg-cream-50 transition-colors cursor-pointer">{t('common.cancel')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}