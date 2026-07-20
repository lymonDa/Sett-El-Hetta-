import { useState, useEffect } from 'react';
import { fetchAllOrders, fetchOrderDetail } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useTranslation } from 'react-i18next';

interface DbOrderItem {
  id: string;
  order_number: string;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  subtotal: number;
  discount_total: number;
  total: number;
  payment_method: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

export default function AdminReportsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const locale = isRtl ? 'ar-EG' : 'en-US';

  const [orders, setOrders] = useState<DbOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [range, setRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topLoading, setTopLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchAllOrders();
        setOrders(all as unknown as DbOrderItem[]);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadTopProducts() {
      setTopLoading(true);
      try {
        const confirmed = orders.filter((o) => ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(o.status));
        const productMap: Record<string, { name: string; sold: number; revenue: number }> = {};

        for (const order of confirmed.slice(0, 50)) {
          try {
            const detail = await fetchOrderDetail(order.id);
            if (detail && detail.items) {
              (detail.items as unknown as { product_name: string; quantity: number; unit_price: number }[]).forEach((item) => {
                const key = item.product_name;
                if (!productMap[key]) productMap[key] = { name: key, sold: 0, revenue: 0 };
                productMap[key].sold += item.quantity;
                productMap[key].revenue += item.unit_price * item.quantity;
              });
            }
          } catch {
            // skip
          }
        }

        const sorted = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
        setTopProducts(sorted);
      } catch {
        // silent
      } finally {
        setTopLoading(false);
      }
    }
    if (orders.length > 0) loadTopProducts();
  }, [orders]);

  const getRangeStart = () => {
    const now = new Date();
    if (range === 'today') {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    if (range === 'week') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    if (range === 'month') {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return d;
    }
    return new Date(0);
  };

  const rangeStart = getRangeStart();
  const filtered = orders.filter((o) => new Date(o.created_at) >= rangeStart);

  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = filtered.filter((o) => o.status === 'PENDING_REVIEW').length;
  const confirmedCount = filtered.filter((o) => o.status === 'CONFIRMED').length;
  const shippedCount = filtered.filter((o) => o.status === 'SHIPPED').length;
  const deliveredCount = filtered.filter((o) => o.status === 'DELIVERED').length;
  const rejectedCount = filtered.filter((o) => o.status === 'REJECTED').length;
  const cancelledCount = filtered.filter((o) => o.status === 'CANCELLED').length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const codOrders = filtered.filter((o) => o.payment_method === 'COD').length;
  const vodaOrders = filtered.filter((o) => o.payment_method === 'VODAFONE_CASH').length;

  const dailyRevenue: Record<string, number> = {};
  filtered.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyRevenue[day] = (dailyRevenue[day] || 0) + o.total;
  });

  const dailyEntries = Object.entries(dailyRevenue).slice(-14);
  const maxDaily = Math.max(...dailyEntries.map(([, v]) => v), 1);

  const statuses = [
    { key: 'PENDING_REVIEW', count: pendingCount, label: t('admin.statusLabel.pending_review'), color: 'bg-gold-400', text: 'text-gold-700' },
    { key: 'CONFIRMED', count: confirmedCount, label: t('admin.statusLabel.confirmed'), color: 'bg-green-400', text: 'text-green-700' },
    { key: 'SHIPPED', count: shippedCount, label: t('admin.statusLabel.shipped'), color: 'bg-espresso-400', text: 'text-espresso-700' },
    { key: 'DELIVERED', count: deliveredCount, label: t('admin.statusLabel.delivered'), color: 'bg-green-500', text: 'text-green-700' },
    { key: 'REJECTED', count: rejectedCount, label: t('admin.statusLabel.rejected'), color: 'bg-red-400', text: 'text-red-700' },
    { key: 'CANCELLED', count: cancelledCount, label: t('admin.statusLabel.cancelled'), color: 'bg-cream-400', text: 'text-espresso-500' },
  ];

  const maxStatus = Math.max(...statuses.map((s) => s.count), 1);

  const rangeLabels: Record<string, string> = {
    today: t('admin.reports.today'),
    week: t('admin.reports.thisWeek'),
    month: t('admin.reports.thisMonth'),
    all: t('admin.reports.allTime'),
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 bg-cream-100 rounded" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-cream-100 rounded-2xl" />)}
            </div>
            <div className="h-64 bg-cream-100 rounded-2xl" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8">
          <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center">
            <p className="font-body text-sm text-red-500 mb-3">{t('admin.loadError')}</p>
            <button onClick={() => window.location.reload()} className="btn-outline text-sm">{t('common.retry')}</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-6">
          <div>
            <h1 className="font-heading font-bold text-xl md:text-2xl text-espresso-900">{t('admin.navReports')}</h1>
            <p className="font-body text-xs md:text-sm text-espresso-500 mt-1">{t('admin.reports.subtitle')}</p>
          </div>
          <div className="flex gap-1 p-1 rounded-xl bg-cream-100 border border-cream-200 self-start sm:self-auto flex-wrap">
            {(['today', 'week', 'month', 'all'] as const).map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg font-heading font-medium text-xs transition-colors cursor-pointer whitespace-nowrap ${range === r ? 'bg-white text-espresso-900 shadow-sm' : 'text-espresso-500 hover:text-espresso-700'}`}>
                {rangeLabels[r]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
          {[
            { icon: 'ri-shopping-bag-3-line', label: t('admin.reports.totalOrders'), value: totalOrders, color: 'text-espresso-600', bg: 'bg-cream-100' },
            { icon: 'ri-money-dollar-circle-line', label: t('admin.reports.totalRevenue'), value: `${totalRevenue.toLocaleString(locale)} ${t('common.EGP')}`, color: 'text-gold-600', bg: 'bg-gold-50' },
            { icon: 'ri-time-line', label: t('admin.reports.pendingOrders'), value: pendingCount, color: 'text-gold-600', bg: 'bg-gold-50' },
            { icon: 'ri-bar-chart-line', label: t('admin.reports.avgOrderValue'), value: `${avgOrderValue.toLocaleString(locale)} ${t('common.EGP')}`, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((stat) => (
            <div key={stat.label} className="p-3 md:p-4 rounded-2xl bg-white border border-cream-200">
              <div className="flex items-center gap-3 mb-2 md:mb-3">
                <div className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg ${stat.bg}`}>
                  <i className={`${stat.icon} ${stat.color} text-sm md:text-base`}></i>
                </div>
              </div>
              <p className="font-heading font-bold text-lg md:text-xl text-espresso-900 break-all">{stat.value}</p>
              <p className="font-body text-xs text-espresso-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-5 md:mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-200 p-5">
            <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.reports.dailyRevenue')}</h3>
            {dailyEntries.length === 0 ? (
              <div className="h-48 flex items-center justify-center">
                <p className="font-body text-sm text-espresso-500">{t('admin.noOrders')}</p>
              </div>
            ) : (
              <div className="flex items-end gap-2 h-48">
                {dailyEntries.map(([day, value]) => {
                  const height = `${Math.max((value / maxDaily) * 100, 4)}%`;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                      <span className="font-heading font-semibold text-xs text-gold-600">{value.toLocaleString('en-US')}</span>
                      <div className="w-full rounded-t-md bg-gold-400 transition-all" style={{ height }}></div>
                      <span className="font-body text-xs text-espresso-500 mt-1 whitespace-nowrap">{day}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-cream-200 p-5">
            <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.reports.statusDistribution')}</h3>
            <div className="space-y-3">
              {statuses.map((s) => {
                const width = totalOrders > 0 ? `${Math.round((s.count / totalOrders) * 100)}%` : '0%';
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <span className={`font-body text-xs ${s.text} w-20 shrink-0`}>{s.label}</span>
                    <div className="flex-1 bg-cream-100 rounded-full h-2.5 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color} transition-all`} style={{ width }}></div>
                    </div>
                    <span className="font-heading font-bold text-xs text-espresso-700 w-8 text-right">{s.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl border border-cream-200 p-5">
            <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.reports.paymentMethods')}</h3>
            <div className="flex gap-8 items-center justify-center py-4">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-8 border-gold-400 flex items-center justify-center mb-2 mx-auto">
                  <span className="font-heading font-bold text-lg text-espresso-900">{codOrders}</span>
                </div>
                <p className="font-body text-sm text-espresso-500">{t('admin.cod')}</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-8 border-espresso-400 flex items-center justify-center mb-2 mx-auto">
                  <span className="font-heading font-bold text-lg text-espresso-900">{vodaOrders}</span>
                </div>
                <p className="font-body text-sm text-espresso-500">{t('admin.vodafoneCash')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-cream-200 p-5">
            <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.reports.topProducts')}</h3>
            {topLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-cream-100 animate-pulse rounded-lg" />)}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-body text-sm text-espresso-500">{t('admin.reports.noTopProducts')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-cream-50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-heading font-bold text-xs text-espresso-500 w-5 shrink-0">#{i + 1}</span>
                      <span className="font-body text-sm text-espresso-900 truncate">{p.name}</span>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="font-heading font-semibold text-sm text-gold-600">{p.revenue.toLocaleString(locale)} {t('common.EGP')}</span>
                      <span className="font-body text-xs text-espresso-500 ml-2">x{p.sold}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}