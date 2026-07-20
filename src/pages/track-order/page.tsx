import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useOrderStore } from '@/stores/orderStore';
import type { Order, OrderStatus } from '@/types';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, PageHeader } from '@/components/feature/EditorialReveal';

const statusConfig: Record<OrderStatus, { label: string; icon: string; color: string; bg: string }> = {
  PENDING_REVIEW: { label: 'Pending Review', icon: 'ri-time-line', color: 'text-gold-700', bg: 'bg-gold-50 border-gold-200' },
  CONFIRMED: { label: 'Confirmed', icon: 'ri-check-line', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  SHIPPED: { label: 'Shipped', icon: 'ri-truck-line', color: 'text-espresso-700', bg: 'bg-cream-100 border-cream-300' },
  DELIVERED: { label: 'Delivered', icon: 'ri-checkbox-circle-line', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  REJECTED: { label: 'Rejected', icon: 'ri-close-circle-line', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  CANCELLED: { label: 'Cancelled', icon: 'ri-forbid-line', color: 'text-espresso-600', bg: 'bg-cream-100 border-cream-300' },
};

const timelineSteps = [
  { status: 'PENDING_REVIEW' as OrderStatus, label: 'Submitted', desc: 'Under review' },
  { status: 'CONFIRMED' as OrderStatus, label: 'Confirmed', desc: 'Preparation started' },
  { status: 'SHIPPED' as OrderStatus, label: 'Shipped', desc: 'On its way to you' },
  { status: 'DELIVERED' as OrderStatus, label: 'Delivered', desc: 'Order arrived' },
];

export default function TrackOrderPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getOrderByNumber } = useOrderStore();

  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSearched(true);
    setOrder(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setError(t('track.enterBoth'));
      setLoading(false);
      return;
    }

    try {
      const found = await getOrderByNumber(orderNumber.trim(), phone.trim());
      if (!found) {
        setError(t('track.notFound'));
      } else {
        setOrder(found);
        setSearchParams({ order: orderNumber.trim(), phone: phone.trim() });
      }
    } catch {
      setError(t('track.searchError'));
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepStatus: OrderStatus) => {
    if (!order) return 'pending';
    const statusOrder: OrderStatus[] = ['PENDING_REVIEW', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepStatus);
    if (order.status === 'REJECTED' || order.status === 'CANCELLED') return stepIndex <= currentIndex ? 'completed' : 'pending';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <MainLayout>
      <PageHeader
        label="Order Tracking"
        title={t('track.title')}
        description={t('track.searchPlaceholder')}
      />

      <section className="bg-cream-50 min-h-[calc(100vh-80px)]">
        <div className="section-padding py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Search Form */}
            <ScaleReveal delay={0.1}>
              <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-cream-200 p-6 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('track.orderNumber')}</label>
                    <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. SEH-2026-0001" className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white" dir="ltr" />
                  </div>
                  <div>
                    <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('track.phone')}</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white" dir="ltr" />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-body mb-4 border border-red-200">
                    <i className="ri-error-warning-line"></i>{error}
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin"></i>{t('track.searching')}</span>
                  ) : (
                    <><i className="ri-search-line mr-2"></i>{t('track.button')}</>
                  )}
                </motion.button>
              </form>
            </ScaleReveal>

            {/* Results */}
            {order && (
              <div className="space-y-6">
                {/* Order Info Card */}
                <Reveal delay={0.1} dir="up" distance={20}>
                  <div className="bg-white rounded-2xl border border-cream-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-body text-sm text-espresso-500">{t('track.orderNumber')}</p>
                        <p className="font-heading font-bold text-lg text-espresso-900" dir="ltr">{order.orderNumber}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-heading font-semibold border ${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}>
                        <i className={statusConfig[order.status].icon}></i>
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-body text-espresso-500 mb-0.5">Date</p>
                        <p className="font-heading font-medium text-espresso-900">{new Date(order.createdAt).toLocaleDateString('en-US')}</p>
                      </div>
                      <div>
                        <p className="font-body text-espresso-500 mb-0.5">{t('track.paymentMethod')}</p>
                        <p className="font-heading font-medium text-espresso-900">{order.paymentMethod === 'COD' ? t('checkout.cod') : t('checkout.vodafoneCash')}</p>
                      </div>
                      <div>
                        <p className="font-body text-espresso-500 mb-0.5">{t('track.total')}</p>
                        <p className="font-heading font-bold text-gold-600">{order.total.toLocaleString('en-US')} EGP</p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Timeline */}
                {order.status !== 'REJECTED' && order.status !== 'CANCELLED' && (
                  <Reveal delay={0.15} dir="up" distance={20}>
                    <div className="bg-white rounded-2xl border border-cream-200 p-6">
                      <h3 className="font-heading font-bold text-base text-espresso-900 mb-6">{t('track.title')}</h3>
                      <div className="relative">
                        <div className="absolute top-5 left-5 w-0.5 h-[calc(100%-40px)] bg-cream-300"></div>
                        <div className="space-y-6">
                          {timelineSteps.map((step) => {
                            const stepStatus = getStepStatus(step.status);
                            return (
                              <div key={step.status} className="flex items-start gap-4 relative">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full shrink-0 z-10 border-2 ${
                                  stepStatus === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                  stepStatus === 'active' ? 'bg-gold-500 border-gold-500 text-white' :
                                  'bg-white border-cream-300 text-espresso-400'
                                }`}>
                                  {stepStatus === 'completed' ? <i className="ri-check-line"></i> :
                                   stepStatus === 'active' ? <i className="ri-loader-4-line animate-spin"></i> :
                                   <i className="ri-circle-line"></i>}
                                </div>
                                <div className="pt-1">
                                  <p className={`font-heading font-semibold text-sm ${stepStatus !== 'pending' ? 'text-espresso-900' : 'text-espresso-400'}`}>{step.label}</p>
                                  <p className="font-body text-xs text-espresso-500">{step.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )}

                {/* Rejected/Cancelled Alert */}
                {(order.status === 'REJECTED' || order.status === 'CANCELLED') && (
                  <Reveal delay={0.15} dir="up" distance={20}>
                    <div className={`rounded-2xl border p-6 ${order.status === 'REJECTED' ? 'bg-red-50 border-red-200' : 'bg-cream-100 border-cream-300'}`}>
                      <div className="flex items-start gap-3">
                        <i className={`text-2xl shrink-0 mt-0.5 ${order.status === 'REJECTED' ? 'ri-close-circle-line text-red-600' : 'ri-forbid-line text-espresso-500'}`}></i>
                        <div>
                          <h3 className="font-heading font-bold text-base text-espresso-900 mb-1">{order.status === 'REJECTED' ? t('track.rejectedTitle') : t('track.cancelledTitle')}</h3>
                          <p className="font-body text-sm text-espresso-500">{order.status === 'REJECTED' ? t('track.rejectedDesc') : t('track.cancelledDesc')}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )}

                {/* Order Items */}
                <Reveal delay={0.2} dir="up" distance={20}>
                  <div className="bg-white rounded-2xl border border-cream-200 p-6">
                    <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('track.orderContents')}</h3>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-cream-200 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="font-body text-sm text-espresso-500">×{item.quantity}</span>
                            <span className="font-body text-sm text-espresso-900">{item.productName}</span>
                          </div>
                          <span className="font-heading font-medium text-sm text-espresso-900">{(item.unitPrice * item.quantity).toLocaleString('en-US')} EGP</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t border-cream-200">
                      <span className="font-heading font-bold text-base text-espresso-900">{t('track.total')}</span>
                      <span className="font-heading font-black text-xl text-gold-600">{order.total.toLocaleString('en-US')} EGP</span>
                    </div>
                  </div>
                </Reveal>

                {/* WhatsApp Contact */}
                <Reveal delay={0.25} dir="up" distance={20}>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/201012345678?text=${encodeURIComponent(`Hello, I'd like to inquire about my order: ${order.orderNumber}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gold-500 text-white font-heading font-semibold hover:bg-gold-600 transition-colors"
                  >
                    <i className="ri-whatsapp-line text-xl"></i>{t('track.contactWhatsApp')}
                  </motion.a>
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}