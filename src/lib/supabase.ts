import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getProductImagesBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || 'lmajhol-products';
}

export async function ensureProductImagesBucket() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error('Supabase non configuré. Ajoutez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.');
  }

  const bucketName = getProductImagesBucketName();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const exists = buckets?.some((bucket) => bucket.name === bucketName || bucket.id === bucketName);
  if (exists) return bucketName;

  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
  });

  if (createError) throw createError;
  return bucketName;
}
