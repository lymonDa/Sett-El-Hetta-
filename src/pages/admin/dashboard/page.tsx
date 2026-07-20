import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { callAdminFunction } from '@/lib/api';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { motion } from 'motion/react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  avgOrderValue: number;
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  recentOrders: Array<{
    id: string;
    order_number: string;
    guest_name: string;
    guest_phone: string;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
  }>;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: 'admin.statusLabel.pending_review',
  CONFIRMED: 'admin.statusLabel.confirmed',
  SHIPPED: 'admin.statusLabel.shipped',
  DELIVERED: 'admin.statusLabel.delivered',
  REJECTED: 'admin.statusLabel.rejected',
  CANCELLED: 'admin.statusLabel.cancelled',
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING_REVIEW: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-gold-50 text-gold-700 border-gold-200',
  SHIPPED: 'bg-espresso-50 text-espresso-700 border-espresso-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-600 border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { admin } = useAdminAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!admin) return;
    setLoading(true);
    setError(null);
    try {
      const result = await callAdminFunction('get_dashboard_stats', { adminId: admin.id });
      setStats(result as DashboardStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [admin]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = stats
    ? [
        { label: t('admin.dashboard.totalOrders'), value: stats.totalOrders, icon: 'ri-shopping-bag-3-line', color: 'bg-espresso-50 text-espresso-700', link: '/admin/orders' },
        { label: t('admin.dashboard.totalRevenue'), value: `${stats.totalRevenue.toLocaleString()} ${t('common.EGP')}`, icon: 'ri-money-dollar-circle-line', color: 'bg-gold-50 text-gold-700', link: '/admin/reports' },
        { label: t('admin.dashboard.pendingOrders'), value: stats.pendingOrders, icon: 'ri-hourglass-line', color: 'bg-yellow-50 text-yellow-700', link: '/admin/orders', highlight: stats.pendingOrders > 0 },
        { label: t('admin.dashboard.avgOrderValue'), value: `${stats.avgOrderValue.toLocaleString()} ${t('common.EGP')}`, icon: 'ri-bar-chart-2-line', color: 'bg-green-50 text-green-700', link: '/admin/reports' },
        { label: t('admin.dashboard.totalProducts'), value: stats.totalProducts, icon: 'ri-price-tag-3-line', color: 'bg-cream-100 text-espresso-700', link: '/admin/products' },
        { label: t('admin.dashboard.lowStockAlert'), value: stats.lowStock + stats.outOfStock, icon: 'ri-alert-line', color: stats.lowStock + stats.outOfStock > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700', link: '/admin/inventory', highlight: (stats.lowStock + stats.outOfStock) > 0 },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8"
        >
          <div>
            <h1 className="font-heading font-black text-xl md:text-2xl text-espresso-900">{t('admin.dashboard.title')}</h1>
            <p className="font-body text-xs md:text-sm text-espresso-500 mt-1">
              {t('admin.dashboard.welcome', { name: admin?.name || '' })}
            </p>
          </div>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-2 text-espresso-500 font-body text-sm">
              <i className="ri-loader-4-line animate-spin"></i>
              {t('common.loading')}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-body border border-red-200 mb-6">
            <i className="ri-error-warning-line text-lg"></i>
            <span>{error}</span>
            <button onClick={fetchStats} className="ml-auto px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors text-xs font-heading cursor-pointer whitespace-nowrap">
              {t('common.retry')}
            </button>
          </div>
        )}

        {stats && !loading && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
              {statCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Link
                    to={card.link}
                    className={`block p-3 md:p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      card.highlight
                        ? 'border-red-200 bg-red-50/50 hover:bg-red-50'
                        : 'border-cream-200 bg-white hover:border-gold-200 hover:bg-cream-50'
                    }`}
                  >
                    <div className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl ${card.color} mb-2 md:mb-3`}>
                      <i className={`${card.icon} text-sm md:text-base`}></i>
                    </div>
                    <p className="font-heading font-black text-lg md:text-xl text-espresso-900">{card.value}</p>
                    <p className="font-body text-xs text-espresso-500 mt-1 whitespace-nowrap">{card.label}</p>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions + Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-white rounded-2xl border border-cream-200 p-4 md:p-5"
              >
                <h3 className="font-heading font-bold text-sm md:text-base text-espresso-900 mb-3 md:mb-4">{t('admin.dashboard.quickActions')}</h3>
                <div className="space-y-2">
                  {[
                    { label: t('admin.dashboard.newOrder'), icon: 'ri-add-circle-line', link: '/admin/orders', desc: t('admin.dashboard.newOrderDesc') },
                    { label: t('admin.dashboard.newProduct'), icon: 'ri-price-tag-3-line', link: '/admin/products/new', desc: t('admin.dashboard.newProductDesc') },
                    { label: t('admin.dashboard.checkInventory'), icon: 'ri-stack-line', link: '/admin/inventory', desc: t('admin.dashboard.checkInventoryDesc') },
                    { label: t('admin.dashboard.newBlogPost'), icon: 'ri-article-line', link: '/admin/blog/new', desc: t('admin.dashboard.newBlogPostDesc') },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      to={action.link}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-cream-100 text-espresso-600 group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors shrink-0">
                        <i className={`${action.icon} text-base`}></i>
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-semibold text-sm text-espresso-900">{action.label}</p>
                        <p className="font-body text-xs text-espresso-500">{action.desc}</p>
                      </div>
                      <i className="ri-arrow-left-s-line text-espresso-400 ml-auto"></i>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="lg:col-span-2 bg-white rounded-2xl border border-cream-200 p-4 md:p-5"
              >
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="font-heading font-bold text-base text-espresso-900">{t('admin.dashboard.recentOrders')}</h3>
                  <Link to="/admin/orders" className="font-body text-xs text-gold-600 hover:text-gold-700 transition-colors cursor-pointer whitespace-nowrap">
                    {t('admin.dashboard.viewAll')} <i className="ri-arrow-left-s-line"></i>
                  </Link>
                </div>

                {stats.recentOrders.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 flex items-center justify-center mx-auto rounded-full bg-cream-100 text-espresso-400 mb-3">
                      <i className="ri-inbox-line text-xl"></i>
                    </div>
                    <p className="font-body text-sm text-espresso-500">{t('admin.dashboard.noRecentOrders')}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-cream-200">
                          <th className="text-left py-2.5 px-3 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap">{t('admin.dashboard.orderNumber')}</th>
                          <th className="text-left py-2.5 px-3 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap">{t('admin.dashboard.customer')}</th>
                          <th className="text-left py-2.5 px-3 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap">{t('admin.dashboard.total')}</th>
                          <th className="text-left py-2.5 px-3 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap">{t('admin.dashboard.status')}</th>
                          <th className="text-right py-2.5 px-3 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-cream-100 hover:bg-cream-50/50 transition-colors">
                            <td className="py-3 px-3 font-body font-medium text-espresso-900 whitespace-nowrap">{order.order_number}</td>
                            <td className="py-3 px-3 font-body text-espresso-700 whitespace-nowrap">{order.guest_name || t('admin.dashboard.guest')}</td>
                            <td className="py-3 px-3 font-body font-medium text-espresso-900 whitespace-nowrap">{order.total.toLocaleString()} {t('common.EGP')}</td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-body border ${STATUS_CLASSES[order.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                {t(STATUS_LABELS[order.status] || 'admin.statusLabel.pending_review')}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <Link
                                to={`/admin/orders/${order.id}`}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-cream-100 text-espresso-400 hover:text-espresso-700 transition-colors cursor-pointer"
                              >
                                <i className="ri-arrow-left-s-line text-base"></i>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}