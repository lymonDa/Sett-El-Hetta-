import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatusEvent, PaymentMethod } from '@/types';
import {
  createOrder as apiCreateOrder,
  uploadPaymentProof as apiUploadProof,
  fetchOrderByNumber as apiFetchOrder,
} from '@/lib/api';

interface OrderState {
  orders: Order[];
  statusEvents: OrderStatusEvent[];
  lastCreatedOrder: Order | null;
  isCreating: boolean;
  createError: string | null;
  createOrder: (data: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: { productId: string; quantity: number; unitPrice: number; productName: string }[];
    subtotal: number;
    total: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    paymentProofFile?: File;
  }) => Promise<Order | null>;
  getOrderByNumber: (orderNumber: string, phone: string) => Promise<Order | null>;
  fetchStatusEvents: (orderId: string) => Promise<OrderStatusEvent[]>;
  updateOrderStatus: (
    orderId: string,
    newStatus: Order['status'],
    adminId: string,
    note?: string
  ) => Promise<void>;
  uploadProof: (orderId: string, file: File) => Promise<string | null>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      statusEvents: [],
      lastCreatedOrder: null,
      isCreating: false,
      createError: null,

      createOrder: async (data) => {
        set({ isCreating: true, createError: null });

        try {
          const dbOrder = await apiCreateOrder({
            guestName: data.customerName,
            guestPhone: data.customerPhone,
            guestAddress: data.customerAddress,
            items: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
            subtotal: data.subtotal,
            total: data.total,
            paymentMethod: data.paymentMethod,
            notes: data.notes,
          });

          const order: Order = {
            id: dbOrder.id,
            orderNumber: dbOrder.order_number,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerAddress: data.customerAddress,
            items: data.items,
            subtotal: data.subtotal,
            discountTotal: 0,
            total: data.total,
            paymentMethod: data.paymentMethod,
            status: 'PENDING_REVIEW',
            notes: data.notes,
            createdAt: dbOrder.created_at,
            updatedAt: dbOrder.updated_at,
          };

          // If there's a payment proof file, upload it
          if (data.paymentProofFile) {
            await apiUploadProof(dbOrder.id, data.paymentProofFile);
          }

          set((state) => ({
            orders: [order, ...state.orders],
            lastCreatedOrder: order,
            isCreating: false,
          }));

          return order;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'An error occurred while creating the order';
          set({ isCreating: false, createError: message });
          return null;
        }
      },

      getOrderByNumber: async (orderNumber: string, phone: string) => {
        // Check local state first
        const local = get().orders.find((o) => o.orderNumber === orderNumber);
        if (local) return local;

        // Fetch from Supabase
        try {
          const result = await apiFetchOrder(orderNumber, phone);
          if (!result) return null;

          const order: Order = {
            id: result.order.id,
            orderNumber: result.order.order_number,
            customerName: result.order.guest_name,
            customerPhone: result.order.guest_phone,
            customerAddress: result.order.guest_address,
            items: result.items.map((item) => ({
              productId: item.product_id,
              quantity: item.quantity,
              unitPrice: item.unit_price,
              productName: item.product_name,
            })),
            subtotal: result.order.subtotal,
            discountTotal: result.order.discount_total,
            total: result.order.total,
            paymentMethod: result.order.payment_method as PaymentMethod,
            status: result.order.status as Order['status'],
            notes: result.order.notes || undefined,
            createdAt: result.order.created_at,
            updatedAt: result.order.updated_at,
          };

          return order;
        } catch {
          return null;
        }
      },

      fetchStatusEvents: async (orderId: string) => {
        try {
          const result = await apiFetchOrder('', '');
          // We need a different approach - fetch events directly
          // This is handled in admin pages via fetchOrderDetail
          return [];
        } catch {
          return [];
        }
      },

      updateOrderStatus: async (orderId, newStatus, adminId, note) => {
        const { updateOrderStatus: apiUpdateStatus } = await import('@/lib/api');
        await apiUpdateStatus(orderId, newStatus, adminId, note);

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
              : o
          ),
        }));
      },

      uploadProof: async (orderId: string, file: File) => {
        try {
          const proof = await apiUploadProof(orderId, file);
          return proof.image_url;
        } catch {
          return null;
        }
      },
    }),
    {
      name: 'sett-el-hetta-orders',
      partialize: (state) => ({
        orders: state.orders,
        lastCreatedOrder: state.lastCreatedOrder,
      }),
    }
  )
);