/**
 * POST /api/contact
 *
 * Cloudflare Pages Function that receives the contact form, verifies the
 * Turnstile spam check, validates input and forwards the enquiry by email.
 * No database: submissions are delivered straight to the inbox.
 *
 * Environment variables (set in Cloudflare Pages > Settings > Variables,
 * or in .dev.vars for local development):
 *   TURNSTILE_SECRET_KEY  required  Turnstile secret key (encrypt it)
 *   EMAIL_API_KEY         required  API key for the email provider (encrypt it)
 *   CONTACT_TO_EMAIL      required  Inbox that receives enquiries
 *   CONTACT_FROM_EMAIL    required  Verified sender, e.g. "DeepTek Website <web@deeptek.ae>"
 *   ALLOWED_ORIGINS       optional  Comma-separated extra origins allowed to post
 *   ENVIRONMENT           optional  "production" disables the dev email fallback
 */

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  EMAIL_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  ALLOWED_ORIGINS?: string;
  ENVIRONMENT?: string;
}

type Fields = {
  name: string;
  email: string;
  company: string;
  phone: string;
  budget: string;
  interest: string[];
  message: string;
};

const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';
const MAX_BODY_BYTES = 32 * 1024;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,24}$/;
const ALLOWED_INTERESTS = new Set(['IT Solutions', 'Digital Marketing', 'AI Automation', 'Not sure']);

type Lang = 'en' | 'ar';

/** Visitor-facing error messages; FormError carries the key. */
const MESSAGES = {
  en: {
    server: 'Something went wrong on our side. Please email us directly.',
    origin: 'This form can only be submitted from our website.',
    unsupported: 'Unsupported request.',
    tooLong: 'Your message is too long.',
    unreadable: 'We could not read the form. Please try again.',
    spamMissing: 'Please complete the spam check and try again.',
    unavailable: 'The form is not available right now. Please email us directly.',
    spamUnreachable: 'We could not verify the spam check. Please try again shortly.',
    spamFailed: 'The spam check failed. Please refresh the page and try again.',
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    phone: 'Please check your phone number.',
    message: 'Please tell us a little more about your project (20 characters minimum).',
    consent: 'Please confirm you agree to the privacy notice.',
    sendFailed: 'We could not send your message right now. Please email us directly.',
  },
  ar: {
    server: 'حدث خطأ من جهتنا. يُرجى مراسلتنا عبر البريد الإلكتروني مباشرة.',
    origin: 'لا يمكن إرسال هذا النموذج إلا من موقعنا.',
    unsupported: 'طلب غير مدعوم.',
    tooLong: 'رسالتك طويلة جداً.',
    unreadable: 'تعذرت قراءة النموذج. يُرجى المحاولة مرة أخرى.',
    spamMissing: 'يُرجى إكمال التحقق من البريد المزعج والمحاولة مرة أخرى.',
    unavailable: 'النموذج غير متاح حالياً. يُرجى مراسلتنا عبر البريد الإلكتروني مباشرة.',
    spamUnreachable: 'تعذر التحقق من البريد المزعج. يُرجى المحاولة بعد قليل.',
    spamFailed: 'فشل التحقق من البريد المزعج. يُرجى تحديث الصفحة والمحاولة مرة أخرى.',
    name: 'يُرجى إدخال اسمك.',
    email: 'يُرجى إدخال بريد إلكتروني صحيح.',
    phone: 'يُرجى التحقق من رقم هاتفك.',
    message: 'يُرجى إخبارنا بالمزيد عن مشروعك (20 حرفاً على الأقل).',
    consent: 'يُرجى تأكيد موافقتك على إشعار الخصوصية.',
    sendFailed: 'تعذر إرسال رسالتك حالياً. يُرجى مراسلتنا عبر البريد الإلكتروني مباشرة.',
  },
} as const;
type MessageKey = keyof (typeof MESSAGES)['en'];

class FormError extends Error {
  constructor(
    message: MessageKey,
    public status = 400,
  ) {
    super(message);
  }
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'POST') return handlePost(request, env);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { Allow: 'POST' } });
  return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
};

async function handlePost(request: Request, env: Env): Promise<Response> {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  // The Arabic form posts to /api/contact?lang=ar so even early errors are in Arabic.
  const lang: Lang = new URL(request.url).searchParams.get('lang') === 'ar' ? 'ar' : 'en';

  try {
    checkOrigin(request, env);
    checkContentType(request);

    const form = await readForm(request);

    // Honeypot filled in: treat as success so bots learn nothing.
    if (str(form.get('website'))) return success(request, wantsJson, lang);

    const token = str(form.get('cf-turnstile-response'));
    await verifyTurnstile(token, request, env);

    const fields = validate(form);
    await sendEmail(fields, env, lang);

    return success(request, wantsJson, lang);
  } catch (err) {
    const status = err instanceof FormError ? err.status : 500;
    const key = (err instanceof FormError ? err.message : 'server') as MessageKey;
    const message = MESSAGES[lang][key];
    if (!(err instanceof FormError)) console.error('contact: unexpected error', err);
    return failure(message, status, wantsJson, lang);
  }
}

/* ---------------- checks ---------------- */

function checkOrigin(request: Request, env: Env) {
  const origin = request.headers.get('Origin');
  const self = new URL(request.url).origin;
  const extra = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  // Browsers always send Origin on cross-site POSTs; reject anything foreign.
  if (origin && origin !== self && !extra.includes(origin)) {
    throw new FormError('origin', 403);
  }
}

function checkContentType(request: Request) {
  const type = request.headers.get('Content-Type') ?? '';
  if (!type.startsWith('multipart/form-data') && !type.startsWith('application/x-www-form-urlencoded')) {
    throw new FormError('unsupported', 415);
  }
  const length = Number(request.headers.get('Content-Length') ?? 0);
  if (length > MAX_BODY_BYTES) throw new FormError('tooLong', 413);
}

async function readForm(request: Request): Promise<FormData> {
  // Re-check size on the actual body in case Content-Length was missing.
  const buf = await request.arrayBuffer();
  if (buf.byteLength > MAX_BODY_BYTES) throw new FormError('tooLong', 413);
  const copy = new Request(request.url, { method: 'POST', headers: request.headers, body: buf });
  try {
    return await copy.formData();
  } catch {
    throw new FormError('unreadable');
  }
}

async function verifyTurnstile(token: string, request: Request, env: Env) {
  if (!token || token.length > 2048) throw new FormError('spamMissing');
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error('contact: TURNSTILE_SECRET_KEY is not set');
    throw new FormError('unavailable', 503);
  }

  // Local development with Cloudflare's always-pass test secret: skip the
  // network call so the form can be tested offline. Never applies in production.
  if (env.ENVIRONMENT !== 'production' && env.TURNSTILE_SECRET_KEY === TURNSTILE_TEST_SECRET) return;

  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.append('remoteip', ip);
  body.append('idempotency_key', crypto.randomUUID());

  let res: Response;
  try {
    res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  } catch (err) {
    console.error('contact: turnstile unreachable', err);
    throw new FormError('spamUnreachable', 503);
  }
  const outcome = (await res.json().catch(() => ({ success: false }))) as {
    success: boolean;
    'error-codes'?: string[];
  };
  if (!outcome.success) {
    console.warn('contact: turnstile failed', outcome['error-codes']);
    throw new FormError('spamFailed', 403);
  }
}

/* ---------------- validation ---------------- */

/** Trim, drop control characters (keeps newlines where allowed) and cap length. */
function clean(value: string, max: number, multiline = false): string {
  const stripped = multiline
    ? value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    : value.replace(/[\u0000-\u001F\u007F]/g, ' ');
  return stripped.trim().slice(0, max);
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function validate(form: FormData): Fields {
  const name = clean(str(form.get('name')), 100);
  const email = clean(str(form.get('email')), 200).toLowerCase();
  const company = clean(str(form.get('company')), 120);
  const phone = clean(str(form.get('phone')), 30);
  const budget = clean(str(form.get('budget')), 60);
  const message = clean(str(form.get('message')), 4000, true);
  const interest = form
    .getAll('interest')
    .map((v) => clean(str(v), 40))
    .filter((v) => ALLOWED_INTERESTS.has(v));

  if (name.length < 2) throw new FormError('name');
  if (!EMAIL_RE.test(email)) throw new FormError('email');
  if (phone && !/^[+()\d\s-]{6,30}$/.test(phone)) throw new FormError('phone');
  if (message.length < 20) throw new FormError('message');
  if (str(form.get('consent')) !== 'yes') throw new FormError('consent');

  return { name, email, company, phone, budget, interest, message };
}

/* ---------------- email ---------------- */

/**
 * Sends the enquiry as a plain-text email. The provider below is Resend
 * (https://resend.com, free tier available) as a placeholder; swap the fetch
 * call for Postmark, Brevo, SendGrid or ZeptoMail if preferred. Plain text
 * avoids any HTML injection from user input.
 */
async function sendEmail(f: Fields, env: Env, lang: Lang) {
  const subject = `New enquiry from ${f.name}${f.company ? ` (${f.company})` : ''}`.slice(0, 150);
  const text = [
    `Name:      ${f.name}`,
    `Email:     ${f.email}`,
    `Company:   ${f.company || '-'}`,
    `Phone:     ${f.phone || '-'}`,
    `Interest:  ${f.interest.join(', ') || '-'}`,
    `Budget:    ${f.budget || '-'}`,
    `Language:  ${lang === 'ar' ? 'Arabic' : 'English'}`,
    '',
    'Message:',
    f.message,
    '',
    '-- Sent from the contact form on the DeepTek website',
  ].join('\n');

  if (!env.EMAIL_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    if (env.ENVIRONMENT === 'production') {
      console.error('contact: email settings are missing');
      throw new FormError('unavailable', 503);
    }
    // Local development without an email provider: log instead of sending.
    console.log(`contact (dev, not sent)\nSubject: ${subject}\n${text}`);
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: f.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    console.error('contact: email provider error', res.status, await res.text().catch(() => ''));
    throw new FormError('sendFailed', 502);
  }
}

/* ---------------- responses ---------------- */

const baseHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function success(request: Request, json: boolean, lang: Lang): Response {
  if (json) {
    return Response.json({ ok: true }, { headers: baseHeaders });
  }
  const thanks = lang === 'ar' ? '/ar/contact/thanks/' : '/contact/thanks/';
  return Response.redirect(new URL(thanks, request.url).toString(), 303);
}

function failure(message: string, status: number, json: boolean, lang: Lang): Response {
  if (json) {
    return Response.json({ ok: false, error: message }, { status, headers: baseHeaders });
  }
  // No-JS fallback: a minimal page with the error and a way back.
  const safe = message.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const t =
    lang === 'ar'
      ? { dir: 'rtl', title: 'لم تُرسل الرسالة', heading: 'لم تُرسل رسالتك', back: 'العودة إلى نموذج التواصل', href: '/ar/contact/' }
      : { dir: 'ltr', title: 'Message not sent', heading: 'Your message was not sent', back: 'Back to the contact form', href: '/contact/' };
  const html = `<!doctype html><html lang="${lang}" dir="${t.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${t.title} | DeepTek</title></head><body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;line-height:1.6"><h1>${t.heading}</h1><p>${safe}</p><p><a href="${t.href}">${t.back}</a></p></body></html>`;
  return new Response(html, {
    status,
    headers: { ...baseHeaders, 'Content-Type': 'text/html; charset=utf-8' },
  });
}
