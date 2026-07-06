import { OrderPayload } from '@/types/store';

function escapeTelegram(text: string) {
  return text.replace(/([_\-*\[\]()~`>#+=|{}.!])/g, '\\$1');
}

export async function sendOrderToTelegram(order: OrderPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error('Telegram non configuré. Ajoutez TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID.');
  }

  const message = [
    '🧾 *Nouvelle commande LMAJHOL*',
    '',
    `👤 *Nom* : ${escapeTelegram(order.fullName)}`,
    `📞 *Téléphone* : ${escapeTelegram(order.phone)}`,
    `🏙️ *Ville* : ${escapeTelegram(order.city)}`,
    `📍 *Adresse* : ${escapeTelegram(order.address)}`,
    `🛍️ *Produit* : ${escapeTelegram(order.productName)}`,
    `🎨 *Couleur* : ${escapeTelegram(order.color)}`,
    `📏 *Taille* : ${escapeTelegram(order.size)}`,
    `🔢 *Quantité* : ${escapeTelegram(String(order.quantity))}`,
    `📝 *Note* : ${escapeTelegram(order.note || 'Aucune')}`
  ].join('\n');

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'MarkdownV2'
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Telegram error: ${text}`);
  }

  return response.json();
}
