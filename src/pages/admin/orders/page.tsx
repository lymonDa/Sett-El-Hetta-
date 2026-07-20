import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllOrders } from '@/lib/api';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useTranslation } from 'react-i18next';
import type { OrderStatus, PaymentMethod } from '@/types';

export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const { admin } = useAdminAuthStore();
  const [allOrders, setAllOrders] = useState<DbOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPayment, setFilterPayment] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const statusLabelKeys: Record<string, string> = {
    PENDING_REVIEW: 'admin.statusLabel.pending_review',
    CONFIRMED: 'admin.statusLabel.confirmed',
    SHIPPED: 'admin.statusLabel.shipped',
    DELIVERED: 'admin.statusLabel.delivered',
    REJECTED: 'admin.statusLabel.rejected',
    CANCELLED: 'admin.statusLabel.cancelled',
  };

  const statusColorMap: Record<string, { color: string; bg: string }> = {
    PENDING_REVIEW: { color: 'text-gold-700', bg: 'bg-gold-50 border border-gold-200' },
    CONFIRMED: { color: 'text-green-700', bg: 'bg-green-50 border border-green-200' },
    SHIPPED: { color: 'text-espresso-700', bg: 'bg-cream-100 border border-cream-300' },
    DELIVERED: { color: 'text-green-700', bg: 'bg-green-50 border border-green-200' },
    REJECTED: { color: 'text-red-700', bg: 'bg-red-50 border border-red-200' },
    CANCELLED: { color: 'text-espresso-500', bg: 'bg-cream-100 border border-cream-200' },
  };

  const paymentLabelKeys: Record<string, string> = {
    COD: 'admin.paymentLabel.cod',
    VODAFONE_CASH: 'admin.paymentLabel.vodafone_cash',
  };

  const ALL_STATUSES: OrderStatus[] = ['PENDING_REVIEW', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'REJECTED', 'CANCELLED'];

  useEffect(() => {
    async function loadOrders() {
      try {
        const orders = await fetchAllOrders();
        setAllOrders(orders as unknown as DbOrderItem[]);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filtered = allOrders.filter((order: DbOrderItem) => {
    if (filterStatus !== 'ALL' && order.status !== filterStatus) return false;
    if (filterPayment !== 'ALL' && order.payment_method !== filterPayment) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!order.order_number.toLowerCase().includes(q) && !order.guest_name.toLowerCase().includes(q) && !order.guest_phone.includes(q)) return false;
    }
    return true;
  });

  const pendingCount = allOrders.filter((o: DbOrderItem) => o.status === 'PENDING_REVIEW').length;

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

  const getStatusLabel = (status: string) => t(statusLabelKeys[status] || 'admin.statusLabel.pending_review');
  const getPaymentLabel = (method: string) => t(paymentLabelKeys[method] || method);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-6">
          <div>
            <h1 className="font-heading font-bold text-xl md:text-2xl text-espresso-900">{t('admin.ordersTitle')}</h1>
            <p className="font-body text-xs md:text-sm text-espresso-500 mt-1">{t('admin.ordersWelcome', { name: admin?.name || '', count: allOrders.length })}</p>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-50 border border-gold-200 self-start sm:self-auto">
              <i className="ri-time-line text-gold-600"></i>
              <span className="font-heading font-semibold text-xs md:text-sm text-gold-700">{t('admin.ordersPending', { count: pendingCount })}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
          {[
            { status: 'PENDING_REVIEW', icon: 'ri-time-line', color: 'text-gold-600', bg: 'bg-gold-50' },
            { status: 'CONFIRMED', icon: 'ri-check-line', color: 'text-green-600', bg: 'bg-green-50' },
            { status: 'SHIPPED', icon: 'ri-truck-line', color: 'text-espresso-600', bg: 'bg-cream-100' },
            { status: 'DELIVERED', icon: 'ri-checkbox-circle-line', color: 'text-green-600', bg: 'bg-green-50' },
          ].map((stat) => {
            const isActive = filterStatus === stat.status;
            return (
              <button key={stat.status} onClick={() => setFilterStatus(isActive ? 'ALL' : stat.status)} className={`p-3 md:p-4 rounded-2xl border transition-all cursor-pointer text-left ${isActive ? 'border-gold-400 bg-gold-50' : 'border-cream-200 bg-white hover:border-cream-400'}`}>
                <div className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg ${stat.bg} mb-2 md:mb-3`}>
                  <i className={`${stat.icon} ${stat.color} text-sm`}></i>
                </div>
                <p className="font-heading font-bold text-lg md:text-xl text-espresso-900">{allOrders.filter((o: DbOrderItem) => o.status === stat.status).length}</p>
                <p className="font-body text-xs text-espresso-500">{getStatusLabel(stat.status)}</p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-cream-200 p-3 md:p-4 mb-5 md:mb-6">
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <div className="relative flex-1">
              <i className="ri-search-line absolute top-1/2 -translate-y-1/2 text-espresso-400 text-sm" style={{ [document.dir === 'rtl' ? 'right' : 'left']: '0.75rem' }}></i>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('admin.searchPlaceholder')} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white" />
            </div>
            <div className="flex gap-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl border border-cream-300 font-body text-xs md:text-sm focus:outline-none focus:border-gold-400 bg-white text-espresso-900 cursor-pointer">
                <option value="ALL">{t('admin.allStatuses')}</option>
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
              </select>
              <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl border border-cream-300 font-body text-xs md:text-sm focus:outline-none focus:border-gold-400 bg-white text-espresso-900 cursor-pointer">
                <option value="ALL">{t('admin.allPaymentMethods')}</option>
                <option value="COD">{t('admin.paymentLabel.cod')}</option>
                <option value="VODAFONE_CASH">{t('admin.paymentLabel.vodafone_cash')}</option>
              </select>
            </div>
          </div>
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
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-cream-200 p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-cream-100">
              <i className="ri-shopping-bag-3-line text-2xl text-espresso-400"></i>
            </div>
            <h3 className="font-heading font-semibold text-lg text-espresso-900 mb-1">{t('admin.noOrders')}</h3>
            <p className="font-body text-sm text-espresso-500">{t('admin.noOrdersHint')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-cream-200 bg-cream-50">
                    {(t('admin.orderTableHeaders', { returnObjects: true }) as string[]).map((h: string) => (
                      <th key={h} className="px-4 py-3 font-heading font-semibold text-xs text-espresso-500 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order: DbOrderItem, index: number) => {
                    const cfg = statusColorMap[order.status] || statusColorMap.PENDING_REVIEW;
                    return (
                      <tr key={order.id} className={`border-b border-cream-200 hover:bg-cream-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-cream-50/40'}`}>
                        <td className="px-4 py-4">
                          <span className="font-heading font-semibold text-sm text-espresso-900" dir="ltr">{order.order_number}</span>
                          {order.payment_method === 'VODAFONE_CASH' && order.status === 'PENDING_REVIEW' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-gold-50 text-gold-600 border border-gold-200 ml-2">
                              <i className="ri-image-line text-xs"></i>{t('admin.needsReview')}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-body text-sm text-espresso-900">{order.guest_name}</p>
                          <p className="font-body text-xs text-espresso-500" dir="ltr">{order.guest_phone}</p>
                        </td>
                        <td className="px-4 py-4"><span className="font-body text-sm text-espresso-700">{getPaymentLabel(order.payment_method)}</span></td>
                        <td className="px-4 py-4"><span className="font-heading font-semibold text-sm text-gold-600">{order.total.toLocaleString('en-US')} {t('common.EGP')}</span></td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-semibold ${cfg.bg} ${cfg.color}`}>{getStatusLabel(order.status)}</span>
                        </td>
                        <td className="px-4 py-4"><span className="font-body text-sm text-espresso-500">{new Date(order.created_at).toLocaleDateString('en-US')}</span></td>
                        <td className="px-4 py-4">
                          <Link to={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 text-white font-heading font-medium text-xs hover:bg-gold-600 transition-colors whitespace-nowrap cursor-pointer">
                            <i className="ri-eye-line"></i>{t('admin.viewDetails')}
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