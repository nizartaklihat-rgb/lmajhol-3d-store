import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/auth';
import { createProduct, getProducts } from '@/lib/products';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const product = await createProduct(body);
    revalidatePath('/');
    revalidatePath('/admin');
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la création.' },
      { status: 500 }
    );
  }
}
