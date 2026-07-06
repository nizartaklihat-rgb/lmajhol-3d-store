import { NextResponse } from 'next/server';
import { createAdminCookieValue, getAdminCookieName, isValidAdminPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(getAdminCookieName(), createAdminCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14
  });

  return response;
}
