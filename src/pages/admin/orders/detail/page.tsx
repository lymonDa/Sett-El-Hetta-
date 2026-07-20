import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderDetail, updateOrderStatus } from '@/lib/api';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useTranslation } from 'react-i18next';
import type { OrderStatus } from '@/types';

const statusLabelKeys: Record<string, string> = {
  PENDING_REVIEW: 'admin.statusLabel.pending_review',
  CONFIRMED: 'admin.statusLabel.confirmed',
  SHIPPED: 'admin.statusLabel.shipped',
  DELIVERED: 'admin.statusLabel.delivered',
  REJECTED: 'admin.statusLabel.rejected',
  CANCELLED: 'admin.statusLabel.cancelled',
};

const statusConfigKeys: Record<string, { icon: string; color: string; bg: string }> = {
  PENDING_REVIEW: { icon: 'ri-time-line', color: 'text-gold-700', bg: 'bg-gold-50 border border-gold-200' },
  CONFIRMED: { icon: 'ri-check-line', color: 'text-green-700', bg: 'bg-green-50 border border-green-200' },
  SHIPPED: { icon: 'ri-truck-line', color: 'text-espresso-700', bg: 'bg-cream-100 border border-cream-300' },
  DELIVERED: { icon: 'ri-checkbox-circle-line', color: 'text-green-700', bg: 'bg-green-50 border border-green-200' },
  REJECTED: { icon: 'ri-close-circle-line', color: 'text-red-700', bg: 'bg-red-50 border border-red-200' },
  CANCELLED: { icon: 'ri-forbid-line', color: 'text-espresso-500', bg: 'bg-cream-100 border border-cream-300' },
};

const ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING_REVIEW: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
};

interface OrderDetail {
  order: {
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
  };
  items: { id: string; product_id: string; quantity: number; unit_price: number; product_name: string }[];
  events: { id: string; from_status: string | null; to_status: string; actor_type: string; note: string | null; created_at: string }[];
  paymentProof: { id: string; image_url: string; status: string; review_note: string | null } | null;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { admin, canConfirmPayments, canUpdateShipping, canViewProofImages } = useAdminAuthStore();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const locale = isRtl ? 'ar-EG' : 'en-US';

  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProofFull, setShowProofFull] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchOrderDetail(id);
        setDetail(data as unknown as OrderDetail);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const getStatusLabel = (status: string) => t(statusLabelKeys[status] || 'admin.statusLabel.pending_review');

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 bg-cream-100 rounded" />
            <div className="h-64 bg-cream-100 rounded-2xl" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !detail) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h2 className="font-heading font-bold text-xl text-espresso-900 mb-2">{t('admin.orderNotFound')}</h2>
          <Link to="/admin/orders" className="btn-primary mt-4 inline-block">{t('admin.backToOrders')}</Link>
        </div>
      </AdminLayout>
    );
  }

  const order = detail.order;
  const items = detail.items;
  const events = detail.events;
  const paymentProof = detail.paymentProof;
  const currentStatus = order.status as OrderStatus;
  const cfg = statusConfigKeys[currentStatus];
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];

  const canSeeParts = {
    confirmReject: canConfirmPayments() && currentStatus === 'PENDING_REVIEW',
    shipping: canUpdateShipping() && (currentStatus === 'CONFIRMED' || currentStatus === 'SHIPPED') && allowedNext.length > 0,
    proofImage: canViewProofImages() && order.payment_method === 'VODAFONE_CASH',
  };

  const handleConfirm = async () => {
    if (!canConfirmPayments() || !admin) return;
    setIsProcessing(true);
    try {
      await updateOrderStatus(order.id, 'CONFIRMED', admin.id, t('admin.processedBy', { name: admin.name }));
      const updated = await fetchOrderDetail(order.id);
      setDetail(updated as unknown as OrderDetail);
    } catch {
      // error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!canConfirmPayments() || !admin || !rejectNote.trim()) return;
    setIsProcessing(true);
    try {
      await updateOrderStatus(order.id, 'REJECTED', admin.id, rejectNote);
      const updated = await fetchOrderDetail(order.id);
      setDetail(updated as unknown as OrderDetail);
      setShowRejectModal(false);
      setRejectNote('');
    } catch {
      // error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async () => {
    if (!targetStatus || !admin) return;
    setIsProcessing(true);
    try {
      await updateOrderStatus(order.id, targetStatus, admin.id, statusNote || undefined);
      const updated = await fetchOrderDetail(order.id);
      setDetail(updated as unknown as OrderDetail);
      setShowStatusModal(false);
      setTargetStatus(null);
      setStatusNote('');
    } catch {
      // error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Link to="/admin/orders" className="w-9 h-9 flex items-center justify-center rounded-xl border border-cream-300 hover:bg-cream-50 transition-colors cursor-pointer shrink-0">
            <i className={`${isRtl ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-espresso-700 text-lg`}></i>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading font-bold text-lg md:text-xl text-espresso-900" dir="ltr">{order.order_number}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-heading font-semibold ${cfg.bg} ${cfg.color}`}>
                <i className={cfg.icon}></i>{getStatusLabel(order.status)}
              </span>
            </div>
            <p className="font-body text-xs md:text-sm text-espresso-500 mt-1">{t('admin.addedAt', { date: new Date(order.created_at).toLocaleString(locale) })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Proof Review */}
            {order.payment_method === 'VODAFONE_CASH' && (
              <div className="bg-white rounded-2xl border-2 border-gold-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gold-50">
                    <i className="ri-image-line text-gold-500"></i>
                  </div>
                  <h2 className="font-heading font-bold text-base text-espresso-900">{t('admin.paymentProof')}</h2>
                  {currentStatus === 'PENDING_REVIEW' && (
                    <span className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gold-50 text-gold-700 text-xs font-semibold border border-gold-200">
                      <i className="ri-time-line"></i>{t('admin.reviewRequired')}
                    </span>
                  )}
                </div>

                {canSeeParts.proofImage ? (
                  <div>
                    <div className="rounded-xl overflow-hidden border border-cream-200 bg-cream-50 mb-4 cursor-pointer" onClick={() => setShowProofFull(true)}>
                      {paymentProof ? (
                        <img src={paymentProof.image_url} alt={t('admin.proofImage')} className="w-full max-h-64 object-contain bg-cream-50" />
                      ) : (
                        <div className="aspect-video flex items-center justify-center bg-cream-50">
                          <div className="text-center p-8">
                            <i className="ri-image-line text-4xl text-espresso-400 mb-2 block"></i>
                            <p className="font-body text-sm text-espresso-500">{t('admin.proofImage')}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {canSeeParts.confirmReject && (
                      <div className="flex gap-3">
                        <button onClick={handleConfirm} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-heading font-semibold text-sm hover:bg-green-600 transition-colors disabled:opacity-50 cursor-pointer">
                          {isProcessing ? <i className="ri-loader-4-line animate-spin"></i> : <><i className="ri-check-double-line"></i>{t('admin.confirmOrder')}</>}
                        </button>
                        <button onClick={() => setShowRejectModal(true)} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-heading font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer">
                          <i className="ri-close-line"></i>{t('admin.rejectOrder')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-body flex items-center gap-2 border border-red-200">
                    <i className="ri-lock-line"></i>{t('admin.noPermissionPayment')}
                  </div>
                )}
              </div>
            )}

            {/* COD Confirm */}
            {order.payment_method === 'COD' && canSeeParts.confirmReject && (
              <div className="bg-white rounded-2xl border border-cream-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gold-50">
                    <i className="ri-money-dollar-circle-line text-gold-500"></i>
                  </div>
                  <h2 className="font-heading font-bold text-base text-espresso-900">{t('admin.codTitle')}</h2>
                </div>
                <p className="font-body text-sm text-espresso-500 mb-4">{t('admin.codNote')}</p>
                <div className="flex gap-3">
                  <button onClick={handleConfirm} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-heading font-semibold text-sm hover:bg-green-600 transition-colors disabled:opacity-50 cursor-pointer">
                    {isProcessing ? <i className="ri-loader-4-line animate-spin"></i> : <><i className="ri-check-double-line"></i>{t('admin.confirmOrder')}</>}
                  </button>
                  <button onClick={() => setShowRejectModal(true)} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-red-300 text-red-500 font-heading font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer">
                    <i className="ri-close-line"></i>{t('admin.rejectOrder')}
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Status */}
            {canSeeParts.shipping && allowedNext.length > 0 && (
              <div className="bg-white rounded-2xl border border-cream-200 p-6">
                <h2 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.shippingTitle')}</h2>
                <div className="flex flex-wrap gap-2">
                  {allowedNext.filter((s) => s === 'SHIPPED' || s === 'DELIVERED' || s === 'CANCELLED').map((nextStatus) => {
                    const sc = statusConfigKeys[nextStatus];
                    return (
                      <button key={nextStatus} onClick={() => { setTargetStatus(nextStatus); setShowStatusModal(true); }} className={`px-4 py-2 rounded-xl text-sm font-heading font-semibold transition-colors flex items-center gap-2 cursor-pointer ${sc.bg} ${sc.color} hover:opacity-80`}>
                        <i className={sc.icon}></i>{t('admin.updateTo', { status: getStatusLabel(nextStatus) })}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-cream-200 p-6">
              <h2 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.orderContents')}</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-cream-200 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="font-body text-sm text-espresso-500">×{item.quantity}</span>
                      <p className="font-body text-sm text-espresso-900">{item.product_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-semibold text-sm text-gold-600">{(item.unit_price * item.quantity).toLocaleString(locale)} {t('common.EGP')}</p>
                      <p className="font-body text-xs text-espresso-500">{item.unit_price.toLocaleString(locale)} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-cream-200 flex justify-between">
                <span className="font-heading font-bold text-base text-espresso-900">{t('admin.total')}</span>
                <span className="font-heading font-black text-xl text-gold-600">{order.total.toLocaleString(locale)} {t('common.EGP')}</span>
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-2xl border border-cream-200 p-6">
              <h2 className="font-heading font-bold text-base text-espresso-900 mb-4">{t('admin.statusHistory')}</h2>
              <div className="space-y-3">
                {events.map((event) => {
                  const sc = statusConfigKeys[event.to_status] || statusConfigKeys.PENDING_REVIEW;
                  return (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className={`w-7 h-7 flex items-center justify-center rounded-full ${sc.bg} shrink-0`}>
                        <i className={`${sc.icon} ${sc.color} text-xs`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-heading font-semibold text-sm text-espresso-900">{getStatusLabel(event.to_status)}</p>
                          <p className="font-body text-xs text-espresso-500 shrink-0">{new Date(event.created_at).toLocaleString(locale)}</p>
                        </div>
                        {event.note && <p className="font-body text-xs text-espresso-500 mt-0.5">{event.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-cream-200 p-5">
              <h3 className="font-heading font-semibold text-sm text-espresso-900 mb-4">{t('admin.customerInfo')}</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <i className="ri-user-line text-espresso-400 shrink-0 mt-0.5"></i>
                  <span className="font-body text-sm text-espresso-900">{order.guest_name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="ri-phone-line text-espresso-400 shrink-0 mt-0.5"></i>
                  <span className="font-body text-sm text-espresso-900" dir="ltr">{order.guest_phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="ri-map-pin-line text-espresso-400 shrink-0 mt-0.5"></i>
                  <span className="font-body text-sm text-espresso-900">{order.guest_address}</span>
                </div>
                {order.notes && (
                  <div className="flex items-start gap-2">
                    <i className="ri-sticky-note-line text-espresso-400 shrink-0 mt-0.5"></i>
                    <span className="font-body text-sm text-espresso-900">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-cream-200 p-5">
              <h3 className="font-heading font-semibold text-sm text-espresso-900 mb-3">{t('admin.paymentSummary')}</h3>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cream-50">
                <i className={`${order.payment_method === 'COD' ? 'ri-money-dollar-circle-line' : 'ri-smartphone-line'} text-gold-500`}></i>
                <span className="font-body text-sm text-espresso-900">{order.payment_method === 'COD' ? t('admin.cod') : t('admin.vodafoneCash')}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${order.guest_phone.replace(/^0/, '20')}?text=${encodeURIComponent(t('admin.whatsappMessage', { orderNumber: order.order_number }))}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors cursor-pointer"
            >
              <i className="ri-whatsapp-line text-lg"></i>{t('admin.contactCustomer')}
            </a>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-cream-200">
            <h3 className="font-heading font-bold text-lg text-espresso-900 mb-2">{t('admin.rejectTitle')}</h3>
            <p className="font-body text-sm text-espresso-500 mb-4">{t('admin.rejectDesc')}</p>
            <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200/50 resize-none mb-2 bg-white" rows={3} placeholder={t('admin.rejectPlaceholder')} maxLength={500} />
            <p className="text-xs text-espresso-400 text-right mb-4">{rejectNote.length}/500</p>
            <div className="flex gap-3">
              <button onClick={handleReject} disabled={isProcessing || !rejectNote.trim()} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-heading font-medium text-sm hover:bg-red-600 disabled:opacity-50 transition-colors cursor-pointer">
                {isProcessing ? t('admin.rejecting') : t('admin.confirmReject')}
              </button>
              <button onClick={() => { setShowRejectModal(false); setRejectNote(''); }} className="flex-1 py-2.5 rounded-xl border border-cream-300 font-heading font-medium text-sm text-espresso-700 hover:bg-cream-50 transition-colors cursor-pointer">{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && targetStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-cream-200">
            <h3 className="font-heading font-bold text-lg text-espresso-900 mb-2">{t('admin.updateTo', { status: getStatusLabel(targetStatus) })}</h3>
            <p className="font-body text-sm text-espresso-500 mb-4">{t('admin.optionalNote')}</p>
            <textarea value={statusNote} onChange={(e) => setStatusNote(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 resize-none mb-4 bg-white" rows={2} placeholder={t('admin.optionalNotePlaceholder')} maxLength={500} />
            <div className="flex gap-3">
              <button onClick={handleStatusChange} disabled={isProcessing} className="flex-1 py-2.5 rounded-xl bg-gold-500 text-white font-heading font-medium text-sm hover:bg-gold-600 disabled:opacity-50 transition-colors cursor-pointer">
                {isProcessing ? t('admin.updating') : t('admin.confirmStatus')}
              </button>
              <button onClick={() => { setShowStatusModal(false); setTargetStatus(null); setStatusNote(''); }} className="flex-1 py-2.5 rounded-xl border border-cream-300 font-heading font-medium text-sm text-espresso-700 hover:bg-cream-50 transition-colors cursor-pointer">{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Full Proof Image Modal */}
      {showProofFull && paymentProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setShowProofFull(false)}>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl overflow-hidden border border-cream-200">
              <div className="flex items-center justify-between p-4 border-b border-cream-200">
                <h3 className="font-heading font-semibold text-sm text-espresso-900">{t('admin.proofFor', { orderNumber: order.order_number })}</h3>
                <button onClick={() => setShowProofFull(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-cream-50 cursor-pointer">
                  <i className="ri-close-line text-espresso-900"></i>
                </button>
              </div>
              <div className="p-4 bg-cream-50">
                <img src={paymentProof.image_url} alt={t('admin.proofImage')} className="w-full max-h-[70vh] object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}