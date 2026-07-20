import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCustomerAuthStore } from '@/stores/customerAuthStore';
import { fetchCustomerOrders } from '@/lib/api';
import type { DbOrder, DbOrderItem } from '@/lib/api';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, PageHeader } from '@/components/feature/EditorialReveal';

type OrderWithItems = {
  order: DbOrder;
  items: (DbOrderItem & { product_name: string })[];
};

const statusConfig: Record<string, { bg: string; text: string; icon: string; label: string }> = {
  PENDING_REVIEW: { bg: 'bg-gold-50 border-gold-200', text: 'text-gold-700', icon: 'ri-time-line', label: 'Pending Review' },
  CONFIRMED: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: 'ri-check-line', label: 'Confirmed' },
  SHIPPED: { bg: 'bg-cream-100 border-cream-300', text: 'text-espresso-700', icon: 'ri-truck-line', label: 'Shipped' },
  DELIVERED: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: 'ri-checkbox-circle-line', label: 'Delivered' },
  REJECTED: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: 'ri-close-circle-line', label: 'Rejected' },
  CANCELLED: { bg: 'bg-cream-100 border-cream-300', text: 'text-espresso-500', icon: 'ri-forbid-line', label: 'Cancelled' },
};

const paymentLabels: Record<string, string> = {
  COD: 'Cash on Delivery',
  VODAFONE_CASH: 'Vodafone Cash',
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { user, customer, isLoading: authLoading, isInitialized } = useCustomerAuthStore();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      navigate('/account/login', { replace: true });
      return;
    }

    async function loadOrders() {
      try {
        const data = await fetchCustomerOrders(user!.id);
        setOrders(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user, isInitialized, navigate]);

  const handleLogout = async () => {
    await useCustomerAuthStore.getState().logout();
    navigate('/');
  };

  if (!isInitialized || authLoading) {
    return (
      <MainLayout>
        <div className="bg-cream-50 min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="flex items-center gap-3 text-espresso-500 font-body text-sm">
            <i className="ri-loader-4-line animate-spin text-xl"></i>
            Loading...
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <PageHeader title="My Orders" />

      <section className="bg-cream-50 min-h-[calc(100vh-80px)]">
        <div className="section-padding py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <Reveal delay={0} dir="up" distance={16}>
                <p className="font-body text-sm text-espresso-500">
                  Hello <span className="font-heading font-semibold text-espresso-900">{customer?.name || ''}</span> — track your order status here
                </p>
              </Reveal>
              <Reveal delay={0.1} dir="up" distance={16}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cream-300 font-body text-sm text-espresso-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-logout-box-r-line"></i>
                  Logout
                </motion.button>
              </Reveal>
            </div>

            {/* Orders */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-cream-200 p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-5 w-32 bg-cream-200 rounded" />
                      <div className="h-6 w-24 bg-cream-200 rounded-full" />
                    </div>
                    <div className="h-4 w-48 bg-cream-200 rounded mb-2" />
                    <div className="h-4 w-28 bg-cream-200 rounded" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <Reveal delay={0} dir="up" distance={30}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
                    <i className="ri-error-warning-line text-2xl text-red-500"></i>
                  </div>
                  <p className="font-body text-sm text-espresso-500 mb-3">Failed to load orders</p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cream-300 font-body text-sm text-espresso-700 hover:bg-cream-100 transition-colors cursor-pointer"
                  >
                    <i className="ri-refresh-line"></i>
                    Retry
                  </motion.button>
                </Reveal>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <SpringReveal delay={0.1} dir="up" distance={40}>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream-100 flex items-center justify-center">
                    <i className="ri-shopping-bag-3-line text-3xl text-espresso-400"></i>
                  </div>
                </SpringReveal>
                <Reveal delay={0.2} dir="up" distance={24}>
                  <h3 className="font-heading font-semibold text-lg text-espresso-900 mb-2">No orders yet</h3>
                </Reveal>
                <Reveal delay={0.3} dir="up" distance={20}>
                  <p className="font-body text-sm text-espresso-500 mb-6">
                    You haven&apos;t placed any orders yet. Browse our products and start shopping!
                  </p>
                </Reveal>
                <SpringReveal delay={0.4} dir="up" distance={24}>
                  <Link to="/products" className="btn-primary px-6 py-3">
                    <i className="ri-shopping-bag-3-line mr-2"></i>
                    Browse Products
                  </Link>
                </SpringReveal>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(({ order, items }, index) => {
                  const cfg = statusConfig[order.status] || statusConfig.PENDING_REVIEW;
                  return (
                    <Reveal key={order.id} delay={0.05 * index} dir="up" distance={24}>
                      <div className="bg-white rounded-2xl border border-cream-200 p-5 md:p-6 hover:border-gold-200 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-heading font-bold text-base text-espresso-900" dir="ltr">{order.order_number}</p>
                            <p className="font-body text-xs text-espresso-500 mt-0.5">
                              {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold border ${cfg.bg} ${cfg.text}`}>
                            <i className={cfg.icon}></i>
                            {cfg.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {items.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-100 text-xs font-body text-espresso-700">
                              {item.product_name}<span className="text-espresso-400">×{item.quantity}</span>
                            </span>
                          ))}
                          {items.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-cream-100 text-xs font-body text-espresso-500">
                              +{items.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-cream-200">
                          <div className="flex items-center gap-4">
                            <span className="font-body text-xs text-espresso-500">{paymentLabels[order.payment_method] || order.payment_method}</span>
                            <span className="font-heading font-bold text-sm text-espresso-900">{order.total.toLocaleString('en-US')} EGP</span>
                          </div>
                          <Link
                            to={`/track-order?order=${order.order_number}&phone=${order.guest_phone}`}
                            className="inline-flex items-center gap-1.5 font-heading font-semibold text-xs text-gold-600 hover:text-gold-700 transition-colors"
                          >
                            Order Details
                            <i className="ri-arrow-right-line"></i>
                          </Link>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}