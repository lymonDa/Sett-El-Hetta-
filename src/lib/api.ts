import { supabase } from '@/lib/supabase';

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
};

export type DbProduct = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  material: string;
  dimensions: string;
  price: string;
  is_bundle: boolean;
  stock_qty: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type DbProductMedia = {
  id: string;
  product_id: string;
  url: string;
  type: string;
  sort_order: number;
};

export type DbCustomer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  created_at: string;
};

export type DbOrder = {
  id: string;
  order_number: string;
  customer_id: string | null;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  subtotal: number;
  discount_total: number;
  total: number;
  payment_method: string;
  status: string;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DbOrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
};

export type DbPaymentProof = {
  id: string;
  order_id: string;
  image_url: string;
  uploaded_at: string;
  status: string;
  reviewed_by: string | null;
  review_note: string | null;
  reviewed_at: string | null;
};

export type DbOrderStatusEvent = {
  id: string;
  order_id: string;
  from_status: string | null;
  to_status: string;
  actor_id: string | null;
  actor_type: string;
  note: string | null;
  created_at: string;
};

export type DbAdminUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  active: boolean;
  created_at: string;
};

export type DbInventoryLog = {
  id: string;
  product_id: string;
  change: number;
  reason: string;
  admin_id: string | null;
  created_at: string;
};

export type DbContactInquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
};

// ---- API Helpers ----

export async function fetchCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function fetchProducts(filters?: {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  search?: string;
}): Promise<{ products: DbProduct[]; media: Record<string, DbProductMedia[]> }> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  if (filters?.categorySlug) {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.categorySlug)
      .single();
    if (catData) {
      query = query.eq('category_id', catData.id);
    }
  }

  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.material) {
    query = query.ilike('material', `%${filters.material}%`);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,material.ilike.%${filters.search}%`);
  }

  const { data: products, error } = await query;

  if (error) throw error;
  if (!products || products.length === 0) return { products: [], media: {} };

  const productIds = products.map((p) => p.id);
  const { data: allMedia } = await supabase
    .from('product_media')
    .select('*')
    .in('product_id', productIds)
    .order('sort_order');

  const mediaMap: Record<string, DbProductMedia[]> = {};
  if (allMedia) {
    allMedia.forEach((m) => {
      if (!mediaMap[m.product_id]) mediaMap[m.product_id] = [];
      mediaMap[m.product_id].push(m);
    });
  }

  return { products, media: mediaMap };
}

export async function fetchProductBySlug(slug: string): Promise<{
  product: DbProduct;
  media: DbProductMedia[];
  category: DbCategory | null;
} | null> {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'ACTIVE')
    .single();

  if (error || !product) return null;

  const [{ data: media }, { data: category }] = await Promise.all([
    supabase.from('product_media').select('*').eq('product_id', product.id).order('sort_order'),
    supabase.from('categories').select('*').eq('id', product.category_id).single(),
  ]);

  return { product, media: media || [], category };
}

export async function createCustomer(data: {
  name: string;
  phone: string;
  email?: string;
}): Promise<DbCustomer> {
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('phone', data.phone)
    .maybeSingle();

  if (existing) {
    const { data: updated, error } = await supabase
      .from('customers')
      .update({ name: data.name, email: data.email || null })
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) throw error;
    return updated;
  }

  const { data: created, error } = await supabase
    .from('customers')
    .insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return created;
}

export async function createOrder(data: {
  customerId?: string;
  guestName: string;
  guestPhone: string;
  guestAddress: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  notes?: string;
}): Promise<DbOrder> {
  const orderNumber = await generateOrderNumber();

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: data.customerId || null,
      guest_name: data.guestName,
      guest_phone: data.guestPhone,
      guest_address: data.guestAddress,
      subtotal: data.subtotal,
      discount_total: 0,
      total: data.total,
      payment_method: data.paymentMethod,
      status: 'PENDING_REVIEW',
      source: 'storefront',
      notes: data.notes || null,
    })
    .select('*')
    .single();

  if (error) throw error;

  // Insert order items
  const orderItems = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  // Insert initial status event
  const { error: eventError } = await supabase.from('order_status_events').insert({
    order_id: order.id,
    from_status: null,
    to_status: 'PENDING_REVIEW',
    actor_type: 'system',
    note: `Order placed via ${data.paymentMethod === 'VODAFONE_CASH' ? 'Vodafone Cash' : 'Cash on Delivery'}`,
  });
  if (eventError) throw eventError;

  // Update inventory
  for (const item of data.items) {
    const { error: invError } = await supabase.from('inventory_logs').insert({
      product_id: item.productId,
      change: -item.quantity,
      reason: 'order_placed',
    });
    if (invError) throw invError;

    // Decrement stock
    await supabase.rpc('decrement_stock', {
      p_product_id: item.productId,
      p_quantity: item.quantity,
    });
  }

  return order;
}

export async function uploadPaymentProof(
  orderId: string,
  file: File
): Promise<DbPaymentProof> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${orderId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('payment-proofs')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(fileName);

  const { data: proof, error } = await supabase
    .from('payment_proofs')
    .insert({
      order_id: orderId,
      image_url: urlData.publicUrl,
      status: 'PENDING',
    })
    .select('*')
    .single();

  if (error) throw error;
  return proof;
}

export async function fetchOrderByNumber(
  orderNumber: string,
  phone: string
): Promise<{ order: DbOrder; items: (DbOrderItem & { product_name: string })[]; events: DbOrderStatusEvent[] } | null> {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .eq('guest_phone', phone)
    .single();

  if (error || !order) return null;

  const [{ data: items }, { data: events }] = await Promise.all([
    supabase
      .from('order_items')
      .select('*, products!inner(name)')
      .eq('order_id', order.id),
    supabase
      .from('order_status_events')
      .select('*')
      .eq('order_id', order.id)
      .order('created_at', { ascending: true }),
  ]);

  const itemsWithNames = (items || []).map((item: Record<string, unknown>) => ({
    id: item.id as string,
    order_id: item.order_id as string,
    product_id: item.product_id as string,
    quantity: item.quantity as number,
    unit_price: item.unit_price as number,
    product_name: (item.products as { name: string }).name,
  }));

  return { order, items: itemsWithNames, events: events || [] };
}

export async function fetchCustomerOrders(userId: string): Promise<{
  order: DbOrder;
  items: (DbOrderItem & { product_name: string })[];
}[]> {
  const { data: customer } = await supabase
    .from('customers')
    .select('id, phone')
    .eq('user_id', userId)
    .maybeSingle();

  if (!customer) return [];

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .or(`customer_id.eq.${customer.id},guest_phone.eq.${customer.phone}`)
    .order('created_at', { ascending: false });

  if (!orders || orders.length === 0) return [];

  const orderIds = orders.map((o) => o.id);
  const { data: allItems } = await supabase
    .from('order_items')
    .select('*, products!inner(name)')
    .in('order_id', orderIds);

  const itemsMap: Record<string, (DbOrderItem & { product_name: string })[]> = {};
  if (allItems) {
    allItems.forEach((item: Record<string, unknown>) => {
      const oid = item.order_id as string;
      if (!itemsMap[oid]) itemsMap[oid] = [];
      itemsMap[oid].push({
        id: item.id as string,
        order_id: item.order_id as string,
        product_id: item.product_id as string,
        quantity: item.quantity as number,
        unit_price: item.unit_price as number,
        product_name: (item.products as { name: string }).name,
      });
    });
  }

  return orders.map((order) => ({
    order,
    items: itemsMap[order.id] || [],
  }));
}

// ---- Admin Functions ----

export async function callAdminFunction(action: string, body: Record<string, unknown>): Promise<unknown> {
  const { data, error } = await supabase.functions.invoke('admin-operations', {
    body: { action, ...body },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function adminLogin(email: string, password: string): Promise<DbAdminUser | null> {
  const { data, error } = await supabase.functions.invoke('admin-operations', {
    body: { action: 'login', email, password },
  });

  if (error || !data?.admin) return null;
  return data.admin;
}

export async function fetchAllOrders(filters?: {
  status?: string;
  paymentMethod?: string;
}): Promise<DbOrder[]> {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.paymentMethod) {
    query = query.eq('payment_method', filters.paymentMethod);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchOrderDetail(orderId: string): Promise<{
  order: DbOrder;
  items: (DbOrderItem & { product_name: string })[];
  events: DbOrderStatusEvent[];
  paymentProof: DbPaymentProof | null;
} | null> {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) return null;

  const [{ data: items }, { data: events }, { data: proof }] = await Promise.all([
    supabase
      .from('order_items')
      .select('*, products!inner(name)')
      .eq('order_id', orderId),
    supabase
      .from('order_status_events')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true }),
    supabase
      .from('payment_proofs')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle(),
  ]);

  const itemsWithNames = (items || []).map((item: Record<string, unknown>) => ({
    id: item.id as string,
    order_id: item.order_id as string,
    product_id: item.product_id as string,
    quantity: item.quantity as number,
    unit_price: item.unit_price as number,
    product_name: (item.products as { name: string }).name,
  }));

  return { order, items: itemsWithNames, events: events || [], paymentProof: proof || null };
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  adminId: string,
  note?: string
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('admin-operations', {
    body: {
      action: 'update_order_status',
      orderId,
      newStatus,
      adminId,
      note: note || null,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
}

export async function submitContactInquiry(data: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from('contact_inquiries').insert(data);
  if (error) throw error;
}

// ---- Product Image Management ----

export async function uploadProductImage(
  productId: string,
  adminId: string,
  file: File
): Promise<DbProductMedia> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-operations', {
          body: {
            action: 'upload_product_image',
            adminId,
            productId,
            fileName: file.name,
            fileData: reader.result as string,
          },
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        resolve(data.media as DbProductMedia);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function deleteProductImage(
  mediaId: string,
  adminId: string
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('admin-operations', {
    body: {
      action: 'delete_product_image',
      adminId,
      mediaId,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
}

export async function reorderProductImages(
  productId: string,
  adminId: string,
  mediaIds: string[]
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('admin-operations', {
    body: {
      action: 'reorder_product_images',
      adminId,
      productId,
      mediaIds,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
}

// ---- Data Transformation Helpers ----

const CATEGORY_IMAGES: Record<string, string> = {
  bracelets: 'https://readdy.ai/api/search-image?query=Elegant%20gold%20bracelets%20collection%20displayed%20on%20cream%20marble%20surface%2C%20soft%20warm%20lighting%2C%20luxury%20artisan%20jewelry%20photography%2C%20minimalist%20composition%2C%20sand%20beige%20background&width=400&height=400&seq=cat-bracelets&orientation=squarish',
  rings: 'https://readdy.ai/api/search-image?query=Gold%20rings%20collection%20arranged%20beautifully%20on%20soft%20velvet%2C%20warm%20golden%20lighting%2C%20luxury%20artisan%20jewelry%20photography%2C%20elegant%20composition%2C%20cream%20and%20gold%20tones&width=400&height=400&seq=cat-rings&orientation=squarish',
  necklaces: 'https://readdy.ai/api/search-image?query=Layered%20gold%20necklaces%20displayed%20on%20white%20marble%2C%20natural%20sunlight%2C%20luxury%20artisan%20jewelry%20photography%2C%20elegant%20minimal%20composition%2C%20warm%20beige%20background&width=400&height=400&seq=cat-necklaces&orientation=squarish',
  anklets: 'https://readdy.ai/api/search-image?query=Delicate%20gold%20anklets%20arranged%20on%20sand%20colored%20silk%20fabric%2C%20soft%20warm%20lighting%2C%20luxury%20artisan%20jewelry%20photography%2C%20elegant%20minimal%20composition%2C%20warm%20beige%20tones&width=400&height=400&seq=cat-anklets&orientation=squarish',
  earrings: 'https://readdy.ai/api/search-image?query=Gold%20earrings%20collection%20displayed%20on%20cream%20marble%2C%20soft%20warm%20lighting%2C%20luxury%20artisan%20jewelry%20photography%2C%20elegant%20minimal%20composition%2C%20neutral%20background&width=400&height=400&seq=cat-earrings&orientation=squarish',
  sets: 'https://readdy.ai/api/search-image?query=Matching%20gold%20jewelry%20set%20with%20necklace%20bracelet%20earrings%2C%20displayed%20on%20cream%20marble%2C%20soft%20warm%20lighting%2C%20luxury%20artisan%20photography%2C%20elegant%20composition%2C%20beige%20background&width=400&height=400&seq=cat-sets&orientation=squarish',
};

export function transformCategory(db: DbCategory): import('@/types').Category {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    description: 'تصفح تشكيلتنا من ' + db.name,
    imageUrl: CATEGORY_IMAGES[db.slug] || CATEGORY_IMAGES.bracelets,
  };
}

const FALLBACK_PRODUCT_IMAGES = [
  'https://readdy.ai/api/search-image?query=Handcrafted%20gold%20jewelry%20piece%20on%20cream%20marble%2C%20warm%20soft%20lighting%2C%20luxury%20artisan%20product%20photography%2C%20minimal%20elegant%20composition%2C%20beige%20sand%20background%2C%20high%20detail&width=400&height=400&seq=prod-fallback-0&orientation=squarish',
  'https://readdy.ai/api/search-image?query=Elegant%20gold%20plated%20bracelet%20with%20delicate%20details%20on%20cream%20marble%2C%20warm%20soft%20lighting%2C%20luxury%20artisan%20product%20photography&width=400&height=400&seq=prod-fallback-1&orientation=squarish',
  'https://readdy.ai/api/search-image?query=Beautiful%20handmade%20gold%20ring%20with%20intricate%20engraving%20on%20cream%20marble%2C%20warm%20soft%20lighting%2C%20luxury%20artisan%20photography&width=400&height=400&seq=prod-fallback-2&orientation=squarish',
  'https://readdy.ai/api/search-image?query=Delicate%20gold%20anklet%20with%20small%20charms%20on%20cream%20marble%2C%20warm%20soft%20lighting%2C%20luxury%20artisan%20product%20photography&width=400&height=400&seq=prod-fallback-3&orientation=squarish',
  'https://readdy.ai/api/search-image?query=Layered%20gold%20necklace%20set%20on%20cream%20marble%20surface%2C%20warm%20soft%20lighting%2C%20luxury%20artisan%20jewelry%20photography&width=400&height=400&seq=prod-fallback-4&orientation=squarish',
  'https://readdy.ai/api/search-image?query=Gold%20earrings%20with%20pearl%20details%20on%20cream%20marble%2C%20warm%20soft%20lighting%2C%20luxury%20artisan%20product%20photography&width=400&height=400&seq=prod-fallback-5&orientation=squarish',
];

export function transformProduct(
  db: DbProduct,
  media: DbProductMedia[],
  index: number
): import('@/types').Product {
  let productMedia: import('@/types').ProductMedia[];

  if (media && media.length > 0) {
    productMedia = media.map((m) => ({
      id: m.id,
      url: m.url,
      type: (m.type as 'image' | 'video') || 'image',
      sortOrder: m.sort_order || 0,
    }));
  } else {
    const fallbackUrl = FALLBACK_PRODUCT_IMAGES[index % FALLBACK_PRODUCT_IMAGES.length];
    productMedia = [
      {
        id: 'gen-' + db.id,
        url: fallbackUrl,
        type: 'image' as const,
        sortOrder: 0,
      },
    ];
  }

  return {
    id: db.id,
    sku: db.sku,
    name: db.name,
    slug: db.slug,
    categoryId: db.category_id,
    description: db.description,
    material: db.material,
    dimensions: db.dimensions,
    price: parseFloat(db.price),
    isBundle: db.is_bundle,
    media: productMedia,
    stockQty: db.stock_qty,
    status: db.status as 'ACTIVE' | 'RETIRED',
    featured: index < 6,
    createdAt: db.created_at,
  };
}

// ---- Helpers ----

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const nextNum = (count || 0) + 1;
  return `SEH-${year}-${String(nextNum).padStart(4, '0')}`;
}