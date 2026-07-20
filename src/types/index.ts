export type ProductMedia = {
  id: string;
  url: string;
  type: 'image' | 'video';
  sortOrder: number;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  material: string;
  dimensions: string;
  price: number;
  isBundle: boolean;
  media: ProductMedia[];
  stockQty: number;
  status: 'ACTIVE' | 'RETIRED';
  featured: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  product: Product;
};

export type OrderStatus =
  | 'PENDING_REVIEW'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'REJECTED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'VODAFONE_CASH';

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    productName: string;
  }[];
  subtotal: number;
  discountTotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderStatusEvent = {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  actorId: string | null;
  actorType: string;
  note: string | null;
  createdAt: string;
};

export type AdminRole = 'OWNER' | 'STAFF' | 'DELIVERY_COORDINATOR';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
};
