import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useCartStore } from '@/stores/cartStore';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, PageHeader } from '@/components/feature/EditorialReveal';

export default function CartPage() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, clearCart } = useCartStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (items.length === 0) {
    return (
      <MainLayout>
        <PageHeader title={t('cart.title')} />
        <section className="bg-cream-50 py-20 md:py-32">
          <div className="section-padding text-center">
            <SpringReveal delay={0.1} dir="up" distance={40}>
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-cream-100">
                <i className="ri-shopping-bag-3-line text-4xl text-espresso-400"></i>
              </div>
            </SpringReveal>
            <Reveal delay={0.2} dir="up" distance={24}>
              <h2 className="font-heading font-bold text-2xl text-espresso-900 mb-3">
                {t('cart.empty')}
              </h2>
            </Reveal>
            <Reveal delay={0.3} dir="up" distance={20}>
              <p className="font-body text-base text-espresso-500 mb-8 max-w-sm mx-auto">
                {t('cart.empty.subtitle')}
              </p>
            </Reveal>
            <SpringReveal delay={0.4} dir="up" distance={24}>
              <Link to="/products" className="btn-primary px-8 py-3">
                {t('cart.continueShopping')}
              </Link>
            </SpringReveal>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader title={t('cart.title')} />

      <section className="bg-cream-50 min-h-[calc(100vh-80px)]">
        <div className="section-padding py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <Reveal delay={0} dir="up" distance={16}>
              <p className="font-body text-sm text-espresso-500">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </Reveal>
            <Reveal delay={0.1} dir="up" distance={16}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowClearConfirm(true)}
                className="text-sm font-body text-espresso-500 hover:text-red-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <i className="ri-delete-bin-line"></i>
                {t('cart.clearCart')}
              </motion.button>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => {
                const product = item.product;
                const imageUrl = product.media[0]?.url || '';

                return (
                  <Reveal key={item.productId} delay={0.05 * index} dir="up" distance={24}>
                    <div className="flex gap-4 p-4 md:p-5 rounded-2xl border border-cream-200 bg-white transition-all duration-300 hover:border-gold-200">
                      <Link
                        to={`/products/${product.slug}`}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cream-50 shrink-0"
                      >
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <Link to={`/products/${product.slug}`} className="block">
                            <h3 className="font-heading font-semibold text-base text-espresso-900 hover:text-gold-600 transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="font-body text-sm text-espresso-500 mt-1">
                            {product.material}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-cream-300 rounded-full overflow-hidden bg-white">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-9 h-9 flex items-center justify-center hover:bg-cream-50 transition-colors text-espresso-900 cursor-pointer"
                            >
                              <i className="ri-subtract-line text-sm"></i>
                            </motion.button>
                            <span className="w-10 text-center font-heading font-bold text-sm text-espresso-900">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center hover:bg-cream-50 transition-colors text-espresso-900 cursor-pointer"
                            >
                              <i className="ri-add-line text-sm"></i>
                            </motion.button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-heading font-bold text-gold-600">
                              {(item.unitPrice * item.quantity).toLocaleString('en-US')} {t('common.EGP')}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.productId)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-espresso-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              aria-label={t('cart.remove')}
                            >
                              <i className="ri-delete-bin-line"></i>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <ScaleReveal delay={0.2}>
                <div className="sticky top-24 p-6 md:p-7 rounded-2xl border border-cream-200 bg-white">
                  <h2 className="font-heading font-bold text-lg text-espresso-900 mb-6">
                    {t('checkout.orderSummary')}
                  </h2>

                  <div className="space-y-3 mb-6 pb-6 border-b border-cream-200">
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-espresso-500">{t('cart.subtotal')}</span>
                      <span className="font-heading font-semibold text-sm text-espresso-900">
                        {getSubtotal().toLocaleString('en-US')} {t('common.EGP')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-espresso-500">{t('cart.shipping')}</span>
                      <span className="font-body text-sm text-green-600">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="font-heading font-bold text-base text-espresso-900">{t('cart.total')}</span>
                    <span className="font-heading font-black text-2xl text-gold-600">
                      {getTotal().toLocaleString('en-US')} {t('common.EGP')}
                    </span>
                  </div>

                  <Link to="/checkout" className="btn-primary w-full py-4 text-base block text-center">
                    {t('cart.checkout')}
                  </Link>

                  <Link to="/products" className="block text-center mt-4 font-body text-sm text-espresso-500 hover:text-gold-600 transition-colors">
                    {t('cart.continueShopping')}
                  </Link>
                </div>
              </ScaleReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full border border-cream-200"
          >
            <h3 className="font-heading font-bold text-lg text-espresso-900 mb-2">
              {t('cart.clearCartConfirm')}
            </h3>
            <p className="font-body text-sm text-espresso-500 mb-6">
              {t('cart.clearCartMessage')}
            </p>
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { clearCart(); setShowClearConfirm(false); }}
                className="flex-1 py-3 rounded-full bg-red-500 text-white font-heading font-medium text-sm hover:bg-red-600 transition-colors cursor-pointer"
              >
                Yes, Clear
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 rounded-full border border-cream-300 font-heading font-medium text-sm text-espresso-700 hover:bg-cream-50 transition-colors cursor-pointer"
              >
                {t('common.cancel')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
}