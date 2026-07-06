import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/auth';
import { deleteProduct, updateProduct } from '@/lib/products';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const product = await updateProduct(params.id, body);
    revalidatePath('/');
    revalidatePath('/admin');
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 });
  }

  try {
    await deleteProduct(params.id);
    revalidatePath('/');
    revalidatePath('/admin');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la suppression.' },
      { status: 500 }
    );
  }
}
