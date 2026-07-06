import { NextResponse } from 'next/server';
import { saveOrder } from '@/lib/products';
import { sendOrderToTelegram } from '@/lib/telegram';
import { OrderPayload } from '@/types/store';

function validate(body: Partial<OrderPayload>) {
  const requiredFields: (keyof OrderPayload)[] = ['fullName', 'phone', 'city', 'address', 'productId', 'productName', 'size', 'quantity', 'color'];
  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`Champ manquant : ${field}`);
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderPayload;
    validate(body);

    await Promise.all([sendOrderToTelegram(body), saveOrder(body)]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du traitement de la commande.' },
      { status: 500 }
    );
  }
}
