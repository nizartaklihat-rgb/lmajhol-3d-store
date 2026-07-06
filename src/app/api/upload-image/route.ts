import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/auth';
import { ensureProductImagesBucket, getProductImagesBucketName, getSupabaseAdmin } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);

function getExtension(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;

  switch (file.type) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/svg+xml':
      return 'svg';
    default:
      return 'bin';
  }
}

export async function POST(request: Request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non configuré. Impossible d’envoyer une image.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const productName = String(formData.get('productName') || 'product');
    const productSlug = String(formData.get('productSlug') || slugify(productName || 'product'));

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Aucun fichier image reçu.' }, { status: 400 });
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: 'Format non supporté. Utilisez PNG, JPG, WEBP ou SVG.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image trop lourde. Maximum 5MB.' }, { status: 400 });
    }

    const bucketName = await ensureProductImagesBucket();
    const extension = getExtension(file);
    const safeSlug = slugify(productSlug || productName || 'product');
    const filePath = `${safeSlug}/${Date.now()}-${randomUUID()}.${extension}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage.from(getProductImagesBucketName()).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      path: filePath,
      bucket: bucketName
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l’upload image.' },
      { status: 500 }
    );
  }
}
