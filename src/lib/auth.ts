import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'lmajhol_admin_session';

function getPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

function buildSignature() {
  const password = getPassword();
  if (!password) return '';

  return crypto
    .createHmac('sha256', password)
    .update('lmajhol-admin')
    .digest('hex');
}

export function createAdminCookieValue() {
  return `ok.${buildSignature()}`;
}

export function isValidAdminPassword(password: string) {
  const expected = getPassword();
  if (!expected) return false;
  return password === expected;
}

export function isAdminSessionValue(value?: string) {
  return value === createAdminCookieValue();
}

export function isAdminSession() {
  const cookieStore = cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return isAdminSessionValue(value);
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}
