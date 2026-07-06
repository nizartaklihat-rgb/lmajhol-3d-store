import { randomUUID } from 'crypto';
import { seedProducts } from '@/lib/seed-products';
import { getSupabaseAdmin } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import { OrderPayload, Product } from '@/types/store';

function mapProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    color: row.color,
    price: row.price,
    currency: row.currency,
    sizes: row.sizes,
    description: row.description,
    materials: row.materials,
    image: row.image,
    featured: row.featured,
    stockStatus: row.stock_status
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return seedProducts;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !data) return seedProducts;
  return data.map(mapProduct);
}

export async function createProduct(input: Partial<Product>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error('Supabase non configuré. Ajoutez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY pour activer l\'admin live.');
  }

  const payload = {
    id: input.id || randomUUID(),
    slug: slugify(input.slug || input.name || 'product'),
    name: input.name || 'Nouveau produit',
    color: input.color || 'Noir',
    price: Number(input.price || 0),
    currency: 'MAD',
    sizes: input.sizes || ['M', 'L'],
    description: input.description || '',
    materials: input.materials || '',
    image: input.image || '/products/black-oversized-tee.svg',
    featured: Boolean(input.featured),
    stock_status: input.stockStatus || 'en_stock'
  };

  const { data, error } = await supabase.from('products').insert(payload).select('*').single();
  if (error) throw error;
  return mapProduct(data);
}

export async function updateProduct(id: string, input: Partial<Product>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error('Supabase non configuré. Ajoutez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY pour activer l\'admin live.');
  }

  const updatePayload: Record<string, any> = {
    ...(input.slug ? { slug: slugify(input.slug) } : {}),
    ...(input.name ? { name: input.name } : {}),
    ...(input.color ? { color: input.color } : {}),
    ...(typeof input.price !== 'undefined' ? { price: Number(input.price) } : {}),
    ...(input.sizes ? { sizes: input.sizes } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.materials ? { materials: input.materials } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(typeof input.featured !== 'undefined' ? { featured: Boolean(input.featured) } : {}),
    ...(input.stockStatus ? { stock_status: input.stockStatus } : {})
  };

  const { data, error } = await supabase
    .from('products')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return mapProduct(data);
}

export async function deleteProduct(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error('Supabase non configuré. Ajoutez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY pour activer l\'admin live.');
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function saveOrder(order: OrderPayload) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      full_name: order.fullName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      product_id: order.productId,
      product_name: order.productName,
      size: order.size,
      quantity: order.quantity,
      color: order.color,
      note: order.note || null,
      source: 'website'
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
