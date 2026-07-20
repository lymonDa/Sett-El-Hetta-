import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchProducts, transformCategory, transformProduct } from '@/lib/api';
import type { Product, Category } from '@/types';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useTranslation } from 'react-i18next';

export default function AdminProductsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const locale = isRtl ? 'ar-EG' : 'en-US';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ACTIVE' | 'RETIRED'>('all');

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
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const lowStock = products.filter((p) => p.stockQty > 0 && p.stockQty <= 5);
  const outOfStock = products.filter((p) => p.stockQty === 0);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-6">
          <div>
            <h1 className="font-heading font-bold text-xl md:text-2xl text-espresso-900">{t('admin.productsTitle')}</h1>
            <p className="font-body text-xs md:text-sm text-espresso-500 mt-1">{t('admin.productsTotal', { count: products.length })}</p>
          </div>
          <Link to="/admin/products/new" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 self-start sm:self-auto whitespace-nowrap">
            <i className="ri-add-line"></i>{t('admin.newProduct')}
          </Link>
        </div>

        {(lowStock.length > 0 || outOfStock.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {outOfStock.length > 0 && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3">
                <i className="ri-error-warning-line text-red-500 text-xl"></i>
                <div>
                  <p className="font-heading font-semibold text-sm text-red-700">{t('admin.outOfStock', { count: outOfStock.length })}</p>
                  <p className="font-body text-xs text-red-600">{outOfStock.map((p) => p.name).join(', ')}</p>
                </div>
              </div>
            )}
            {lowStock.length > 0 && (
              <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 flex items-center gap-3">
                <i className="ri-alarm-warning-line text-gold-600 text-xl"></i>
                <div>
                  <p className="font-heading font-semibold text-sm text-gold-700">{t('admin.lowStock', { count: lowStock.length })}</p>
                  <p className="font-body text-xs text-gold-600">{lowStock.map((p) => p.name).join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-cream-200 p-3 md:p-4 mb-5 md:mb-6 flex flex-col sm:flex-row gap-2 md:gap-3">
          <div className="relative flex-1">
            <i className="ri-search-line absolute top-1/2 -translate-y-1/2 text-espresso-400 text-sm" style={isRtl ? { right: '0.75rem' } : { left: '0.75rem' }}></i>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.searchProductPlaceholder')} className="w-full py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white" style={isRtl ? { paddingRight: '2.25rem', paddingLeft: '1rem' } : { paddingLeft: '2.25rem', paddingRight: '1rem' }} />
          </div>
          <div className="flex gap-2">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl border border-cream-300 font-body text-xs md:text-sm bg-white focus:outline-none focus:border-gold-400 text-espresso-900 cursor-pointer">
              <option value="all">{t('admin.allCategories')}</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'all' | 'ACTIVE' | 'RETIRED')} className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl border border-cream-300 font-body text-xs md:text-sm bg-white focus:outline-none focus:border-gold-400 text-espresso-900 cursor-pointer">
              <option value="all">{t('admin.allStatuses')}</option>
              <option value="ACTIVE">{t('admin.statusFilter.active')}</option>
              <option value="RETIRED">{t('admin.statusFilter.retired')}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-cream-100 animate-pulse rounded-xl" />)}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center">
            <p className="font-body text-sm text-red-500 mb-3">{t('admin.productsLoadError')}</p>
            <button onClick={() => window.location.reload()} className="btn-outline text-sm">{t('common.retry')}</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-cream-200 bg-cream-50">
                    {(t('admin.productTableHeaders', { returnObjects: true }) as string[]).map((h: string) => (
                      <th key={h} className="px-4 py-3 font-heading font-semibold text-xs text-espresso-500 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const imageUrl = product.media[0]?.url || '';
                    const cat = categories.find((c) => c.id === product.categoryId);
                    const stockClass = product.stockQty === 0 ? 'text-red-600' : product.stockQty <= 5 ? 'text-gold-600' : 'text-green-600';
                    return (
                      <tr key={product.id} className="border-b border-cream-200 hover:bg-cream-50 transition-colors">
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
                        <td className="px-4 py-3"><span className="font-body text-sm text-espresso-500">{cat?.name}</span></td>
                        <td className="px-4 py-3"><span className="font-heading font-semibold text-sm text-gold-600">{product.price.toLocaleString(locale)} {t('common.EGP')}</span></td>
                        <td className="px-4 py-3">
                          <span className={`font-heading font-bold text-sm ${stockClass}`}>
                            {product.stockQty}
                            {product.stockQty === 0 && <span className="font-body font-normal text-xs ml-1">{t('admin.outOfStockLabel')}</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-heading font-medium ${product.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-cream-100 text-espresso-500 border border-cream-300'}`}>
                            {product.status === 'ACTIVE' ? t('admin.statusFilter.active') : t('admin.statusFilter.retired')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/admin/products/${product.id}/edit`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cream-300 text-espresso-700 font-heading font-medium text-xs hover:bg-cream-50 transition-colors whitespace-nowrap cursor-pointer">
                            <i className="ri-edit-line"></i>{t('admin.edit')}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}