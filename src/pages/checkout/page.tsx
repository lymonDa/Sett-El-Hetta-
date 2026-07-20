import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useCartStore } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import MainLayout from '@/components/feature/MainLayout';
import { Reveal, SpringReveal, ScaleReveal, PageHeader, LineDraw } from '@/components/feature/EditorialReveal';

type CheckoutStep = 1 | 2 | 3;

interface CustomerForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();
  const { createOrder, isCreating, createError } = useOrderStore();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [customer, setCustomer] = useState<CustomerForm>({
    name: '', phone: '', address: '', city: '', notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VODAFONE_CASH'>('COD');
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [proofError, setProofError] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerForm, string>>>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (items.length === 0) {
    return (
      <MainLayout>
        <PageHeader title={t('checkout.title')} />
        <section className="bg-cream-50 py-20">
          <div className="section-padding text-center">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-cream-100">
              <i className="ri-shopping-bag-3-line text-3xl text-espresso-400"></i>
            </div>
            <h2 className="font-heading font-bold text-xl text-espresso-900 mb-2">{t('checkout.cartEmptyMessage')}</h2>
            <Link to="/products" className="btn-primary mt-4 inline-block">{t('cart.continueShopping')}</Link>
          </div>
        </section>
      </MainLayout>
    );
  }

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof CustomerForm, string>> = {};
    if (!customer.name.trim()) newErrors.name = t('checkout.nameRequired');
    if (!customer.phone.trim()) newErrors.phone = t('checkout.phoneRequired');
    else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(customer.phone.trim())) newErrors.phone = t('checkout.phoneInvalid');
    if (!customer.address.trim()) newErrors.address = t('checkout.addressRequired');
    if (!customer.city.trim()) newErrors.city = t('checkout.cityRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (paymentMethod === 'VODAFONE_CASH' && !paymentProofFile) {
      setProofError(t('checkout.proofRequired'));
      return false;
    }
    setProofError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as CheckoutStep);
      window.scrollTo(0, 0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProofError('Please select an image file (JPG or PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProofError('Image size must not exceed 5 MB');
      return;
    }

    setProofError('');
    setPaymentProofFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPaymentProof(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const order = await createOrder({
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: `${customer.address}, ${customer.city}`,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productName: item.product.name,
      })),
      subtotal: getSubtotal(),
      total: getTotal(),
      paymentMethod,
      notes: customer.notes,
      paymentProofFile: paymentProof ? paymentProofFile || undefined : undefined,
    });

    if (!order) return;

    clearCart();
    navigate(`/order-confirmation?order=${order.orderNumber}`);
  };

  const stepLabels = [
    { num: 1, label: t('checkout.step1') },
    { num: 2, label: t('checkout.step2') },
    { num: 3, label: t('checkout.step3') },
  ];

  return (
    <MainLayout>
      <PageHeader title={t('checkout.title')} />

      <section className="bg-cream-50 min-h-[calc(100vh-80px)]">
        <div className="section-padding py-8 md:py-12">
          {/* Stepper */}
          <Reveal delay={0.1} dir="up" distance={20}>
            <div className="flex items-center gap-2 mb-10 max-w-2xl mx-auto">
              {stepLabels.map((s, index) => (
                <div key={s.num} className="flex items-center gap-2 flex-1">
                  <div className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full font-heading font-bold text-sm shrink-0 transition-colors ${
                    step >= s.num ? 'bg-gold-500 text-white' : 'bg-cream-100 text-espresso-400'
                  }`}>{s.num}</div>
                  <span className={`font-heading font-medium text-xs hidden sm:block ${
                    step >= s.num ? 'text-espresso-900' : 'text-espresso-400'
                  }`}>{s.label}</span>
                  {index < stepLabels.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 transition-colors ${step > s.num ? 'bg-gold-400' : 'bg-cream-300'}`} />
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <Reveal delay={0} dir="up" distance={20}>
                    <h2 className="font-heading font-bold text-lg text-espresso-900 mb-5">{t('checkout.step1')}</h2>
                  </Reveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Reveal delay={0.05} dir="up" distance={20}>
                      <div>
                        <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('checkout.name')} *</label>
                        <input type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className={`w-full px-4 py-3 rounded-xl border font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white ${errors?.name ? 'border-red-400' : 'border-cream-300'}`} placeholder="Enter your full name" />
                        {errors?.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                      </div>
                    </Reveal>
                    <Reveal delay={0.1} dir="up" distance={20}>
                      <div>
                        <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('checkout.phone')} *</label>
                        <input type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className={`w-full px-4 py-3 rounded-xl border font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white ${errors?.phone ? 'border-red-400' : 'border-cream-300'}`} placeholder="01xxxxxxxxx" dir="ltr" />
                        {errors?.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                      </div>
                    </Reveal>
                  </div>

                  <Reveal delay={0.15} dir="up" distance={20}>
                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('checkout.address')} *</label>
                      <input type="text" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} className={`w-full px-4 py-3 rounded-xl border font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white ${errors?.address ? 'border-red-400' : 'border-cream-300'}`} placeholder="Street, neighborhood, building number" />
                      {errors?.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                    </div>
                  </Reveal>

                  <Reveal delay={0.2} dir="up" distance={20}>
                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('checkout.city')} *</label>
                      <input type="text" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} className={`w-full px-4 py-3 rounded-xl border font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white ${errors?.city ? 'border-red-400' : 'border-cream-300'}`} placeholder={t('checkout.cityPlaceholder')} />
                      {errors?.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                    </div>
                  </Reveal>

                  <Reveal delay={0.25} dir="up" distance={20}>
                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('checkout.notes')}</label>
                      <textarea value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 transition-all bg-white resize-none" rows={3} placeholder={t('checkout.notesPlaceholder')} />
                    </div>
                  </Reveal>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <Reveal delay={0} dir="up" distance={20}>
                    <h2 className="font-heading font-bold text-lg text-espresso-900 mb-5">{t('checkout.step2')}</h2>
                  </Reveal>

                  <div className="space-y-3">
                    <Reveal delay={0.05} dir="up" distance={20}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setPaymentMethod('COD'); setProofError(''); }}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${paymentMethod === 'COD' ? 'border-gold-400 bg-gold-50' : 'border-cream-200 hover:border-cream-400 bg-white'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'COD' ? 'border-gold-500 bg-gold-500' : 'border-cream-400'}`}>
                            {paymentMethod === 'COD' && <i className="ri-check-line text-white text-xs"></i>}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <i className="ri-money-dollar-circle-line text-xl text-gold-500"></i>
                              <span className="font-heading font-semibold text-base text-espresso-900">{t('checkout.cod')}</span>
                            </div>
                            <p className="font-body text-sm text-espresso-500">Pay in cash when you receive your order</p>
                          </div>
                        </div>
                      </motion.button>
                    </Reveal>

                    <Reveal delay={0.1} dir="up" distance={20}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setPaymentMethod('VODAFONE_CASH'); setProofError(''); }}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${paymentMethod === 'VODAFONE_CASH' ? 'border-gold-400 bg-gold-50' : 'border-cream-200 hover:border-cream-400 bg-white'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'VODAFONE_CASH' ? 'border-gold-500 bg-gold-500' : 'border-cream-400'}`}>
                            {paymentMethod === 'VODAFONE_CASH' && <i className="ri-check-line text-white text-xs"></i>}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <i className="ri-smartphone-line text-xl text-gold-500"></i>
                              <span className="font-heading font-semibold text-base text-espresso-900">{t('checkout.vodafoneCash')}</span>
                            </div>
                            <p className="font-body text-sm text-espresso-500">{t('checkout.manualTransfer')}</p>
                          </div>
                        </div>
                      </motion.button>
                    </Reveal>
                  </div>

                  {paymentMethod === 'VODAFONE_CASH' && (
                    <Reveal delay={0.15} dir="up" distance={20}>
                      <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200">
                        <h3 className="font-heading font-semibold text-sm text-espresso-900 mb-3">{t('checkout.vodafoneInstructions')}</h3>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-cream-200 mb-4">
                          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gold-50">
                            <i className="ri-phone-line text-gold-500"></i>
                          </div>
                          <div>
                            <p className="font-heading font-semibold text-sm text-espresso-900">{t('checkout.vodafoneNumber')}</p>
                            <p className="font-body text-sm text-espresso-500" dir="ltr">+20 10 1234 5678</p>
                          </div>
                        </div>
                        <p className="font-body text-sm text-espresso-500 mb-3">
                          {t('checkout.transferAmount')}{' '}
                          <span className="font-heading font-bold text-gold-600">{getTotal().toLocaleString('en-US')} EGP</span>
                        </p>
                        <div>
                          <label className="block font-heading font-semibold text-sm text-espresso-900 mb-2">{t('checkout.uploadProof')} *</label>
                          {paymentProof ? (
                            <div className="relative rounded-xl overflow-hidden border border-cream-200 mb-3">
                              <img src={paymentProof} alt="Proof of transfer" className="w-full max-h-64 object-contain bg-cream-50" />
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setPaymentProof(null); setPaymentProofFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                              >
                                <i className="ri-close-line text-sm"></i>
                              </motion.button>
                            </div>
                          ) : (
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-8 rounded-xl border-2 border-dashed border-cream-300 hover:border-gold-400 hover:bg-gold-50/50 transition-all cursor-pointer"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <i className="ri-upload-cloud-line text-3xl text-espresso-400"></i>
                                <span className="font-body text-sm text-espresso-500">{t('checkout.clickToUpload')}</span>
                                <span className="font-body text-xs text-espresso-400">JPG or PNG, max 5 MB</span>
                              </div>
                            </motion.button>
                          )}
                          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleFileUpload} className="hidden" />
                          {proofError && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1"><i className="ri-error-warning-line"></i>{proofError}</p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  )}
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <Reveal delay={0} dir="up" distance={20}>
                    <h2 className="font-heading font-bold text-lg text-espresso-900 mb-5">{t('checkout.step3')}</h2>
                  </Reveal>

                  <Reveal delay={0.05} dir="up" distance={20}>
                    <div className="p-5 rounded-2xl border border-cream-200 bg-cream-50">
                      <h3 className="font-heading font-semibold text-sm text-espresso-900 mb-3">{t('checkout.step1')}</h3>
                      <div className="space-y-2 font-body text-sm">
                        <p className="text-espresso-900"><span className="text-espresso-500">{t('checkout.customerName')}:</span> {customer.name}</p>
                        <p className="text-espresso-900" dir="ltr"><span className="text-espresso-500">{t('checkout.customerPhone')}:</span> {customer.phone}</p>
                        <p className="text-espresso-900"><span className="text-espresso-500">{t('checkout.customerAddress')}:</span> {customer.address}, {customer.city}</p>
                        {customer.notes && <p className="text-espresso-900"><span className="text-espresso-500">{t('checkout.customerNotes')}:</span> {customer.notes}</p>}
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.1} dir="up" distance={20}>
                    <div className="p-5 rounded-2xl border border-cream-200 bg-cream-50">
                      <h3 className="font-heading font-semibold text-sm text-espresso-900 mb-3">{t('checkout.paymentSummary')}</h3>
                      <div className="flex items-center gap-3">
                        <i className={`ri-${paymentMethod === 'COD' ? 'money-dollar-circle' : 'smartphone'}-line text-xl text-gold-500`}></i>
                        <span className="font-body text-sm text-espresso-900">{paymentMethod === 'COD' ? t('checkout.cod') : t('checkout.vodafoneCash')}</span>
                        {paymentMethod === 'VODAFONE_CASH' && paymentProof && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                            <i className="ri-check-line"></i>{t('checkout.proofUploaded')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Reveal>

                  <div className="space-y-3">
                    {items.map((item, idx) => {
                      const imageUrl = item.product.media[0]?.url || '';
                      return (
                        <Reveal key={item.productId} delay={0.05 * idx} dir="up" distance={16}>
                          <div className="flex gap-3 p-3 rounded-xl border border-cream-200 bg-white">
                            <img src={imageUrl} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-cream-50 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-heading font-medium text-sm text-espresso-900 line-clamp-1">{item.product.name}</h4>
                              <p className="font-body text-xs text-espresso-500 mt-0.5">{t('cart.quantity')}: {item.quantity}</p>
                            </div>
                            <span className="font-heading font-semibold text-sm text-gold-600 shrink-0">{(item.unitPrice * item.quantity).toLocaleString('en-US')} EGP</span>
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>

                  <Reveal delay={0.2} dir="up" distance={20}>
                    <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200">
                      <div className="flex items-start gap-3">
                        <i className="ri-time-line text-lg text-gold-600 shrink-0 mt-0.5"></i>
                        <div>
                          <p className="font-heading font-semibold text-sm text-espresso-900 mb-1">Your order will be under review</p>
                          <p className="font-body text-sm text-espresso-500">{t('checkout.orderNote')}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              )}

              {/* Error */}
              {createError && (
                <Reveal delay={0} dir="up" distance={16}>
                  <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2 border border-red-200">
                    <i className="ri-error-warning-line"></i>
                    {createError}
                  </div>
                </Reveal>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-cream-200">
                {step > 1 && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBack}
                    className="px-6 py-3 rounded-full border border-cream-300 font-heading font-semibold text-sm text-espresso-900 hover:bg-cream-50 transition-colors cursor-pointer"
                  >
                    {t('checkout.back')}
                  </motion.button>
                )}
                {step < 3 ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    className="btn-primary px-8 py-3 ml-auto"
                  >
                    {t('checkout.next')}
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={isCreating}
                    className="btn-primary px-8 py-3 ml-auto disabled:opacity-50"
                  >
                    {isCreating ? (
                      <span className="flex items-center gap-2"><i className="ri-loader-4-line animate-spin"></i>{t('checkout.submitting')}</span>
                    ) : (
                      <span className="flex items-center gap-2"><i className="ri-check-double-line"></i>{t('checkout.placeOrder')}</span>
                    )}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <ScaleReveal delay={0.3}>
                <div className="sticky top-24 p-6 md:p-7 rounded-2xl border border-cream-200 bg-white">
                  <h3 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('checkout.orderSummary')}</h3>
                  <div className="space-y-2 mb-4">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="font-body text-espresso-500 line-clamp-1">{item.product.name} × {item.quantity}</span>
                        <span className="font-heading text-espresso-900">{(item.unitPrice * item.quantity).toLocaleString('en-US')}</span>
                      </div>
                    ))}
                  </div>
                  <LineDraw color="bg-cream-300" className="mb-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-espresso-500">{t('cart.subtotal')}</span>
                      <span className="font-heading text-sm text-espresso-900">{getSubtotal().toLocaleString('en-US')} {t('common.EGP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-espresso-500">{t('cart.shipping')}</span>
                      <span className="font-body text-sm text-green-600">Free</span>
                    </div>
                  </div>
                  <LineDraw color="bg-cream-300" className="mt-4 mb-4" />
                  <div className="flex justify-between">
                    <span className="font-heading font-bold text-base text-espresso-900">{t('cart.total')}</span>
                    <span className="font-heading font-black text-xl text-gold-600">{getTotal().toLocaleString('en-US')} {t('common.EGP')}</span>
                  </div>
                </div>
              </ScaleReveal>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}