import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useOrderStore } from '@/stores/orderStore';
import type { Order } from '@/types';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, SectionHeader } from '@/components/feature/EditorialReveal';

export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const { getOrderByNumber, lastCreatedOrder } = useOrderStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      if (lastCreatedOrder?.orderNumber === orderNumber) {
        setOrder(lastCreatedOrder);
        setLoading(false);
        return;
      }

      if (orderNumber) {
        try {
          const phone = searchParams.get('phone') || '';
          const found = await getOrderByNumber(orderNumber, phone);
          if (found) {
            setOrder(found);
          }
        } catch {
          // ignore
        }
      }
      setLoading(false);
    }

    loadOrder();
    window.scrollTo(0, 0);
  }, [orderNumber]);

  if (loading) {
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

  if (!order) {
    return (
      <MainLayout>
        <div className="bg-cream-50 min-h-[calc(100vh-80px)]">
          <div className="section-padding py-20 text-center">
            <Reveal delay={0} dir="up" distance={30}>
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-cream-100">
                <i className="ri-error-warning-line text-3xl text-espresso-400"></i>
              </div>
              <h2 className="font-heading font-bold text-xl text-espresso-900 mb-2">Order Not Found</h2>
              <Link to="/products" className="btn-primary mt-4 inline-block">{t('order.confirmation.browseProducts')}</Link>
            </Reveal>
          </div>
        </div>
      </MainLayout>
    );
  }

  const whatsappFollowUp = `Hello, I'd like to inquire about my order: ${order.orderNumber}`;

  return (
    <MainLayout whatsappMessage={whatsappFollowUp}>
      <div className="bg-cream-50 min-h-[calc(100vh-80px)]">
        <div className="section-padding py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-10">
              <SpringReveal delay={0.1} dir="up" distance={40}>
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gold-50 border border-gold-200">
                  <i className="ri-time-line text-4xl text-gold-600"></i>
                </div>
              </SpringReveal>
              <Reveal delay={0.2} dir="up" distance={24}>
                <h1 className="font-heading font-black text-2xl md:text-3xl text-espresso-900 mb-3">{t('order.confirmation.title')}</h1>
              </Reveal>
              <Reveal delay={0.3} dir="up" distance={20}>
                <p className="font-body text-base text-espresso-500 max-w-md mx-auto">{t('order.confirmation.subtitle')}</p>
              </Reveal>
            </div>

            {/* Order Card */}
            <ScaleReveal delay={0.2}>
              <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8 mb-8">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-cream-200">
                  <div>
                    <p className="font-body text-sm text-espresso-500 mb-1">{t('order.confirmation.orderNumber')}</p>
                    <p className="font-heading font-bold text-lg text-espresso-900" dir="ltr">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm text-espresso-500 mb-1">{t('order.confirmation.status')}</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 text-gold-700 text-sm font-heading font-semibold border border-gold-200">
                      <i className="ri-time-line"></i>{t('order.confirmation.pendingReview')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-body text-sm text-espresso-500">×{item.quantity}</span>
                        <span className="font-body text-sm text-espresso-900">{item.productName}</span>
                      </div>
                      <span className="font-heading font-semibold text-sm text-espresso-900">{(item.unitPrice * item.quantity).toLocaleString('en-US')} EGP</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cream-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-espresso-500">{t('cart.subtotal')}</span>
                    <span className="font-heading text-sm text-espresso-900">{order.subtotal.toLocaleString('en-US')} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-espresso-500">{t('cart.shipping')}</span>
                    <span className="font-body text-sm text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-cream-200">
                    <span className="font-heading font-bold text-base text-espresso-900">{t('cart.total')}</span>
                    <span className="font-heading font-black text-xl text-gold-600">{order.total.toLocaleString('en-US')} EGP</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-cream-200">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-espresso-500">{t('track.paymentMethod')}</span>
                    <span className="font-heading font-medium text-sm text-espresso-900">{order.paymentMethod === 'COD' ? t('checkout.cod') : t('checkout.vodafoneCash')}</span>
                  </div>
                </div>
              </div>
            </ScaleReveal>

            {/* Actions */}
            <Reveal delay={0.3} dir="up" distance={24}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link to={`/track-order?order=${order.orderNumber}&phone=${encodeURIComponent(order.customerPhone)}`} className="btn-primary px-8 py-3 text-center">
                  <i className="ri-map-pin-line mr-2"></i>{t('order.confirmation.track')}
                </Link>
                <Link to="/products" className="btn-outline px-8 py-3 text-center">
                  {t('order.confirmation.continue')}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.4} dir="up" distance={16}>
              <a href={`https://wa.me/201012345678?text=${encodeURIComponent(whatsappFollowUp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 font-body text-sm text-gold-600 hover:text-gold-700 transition-colors">
                <i className="ri-whatsapp-line text-lg"></i>{t('order.confirmation.contactWhatsApp')}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}