'use server';

import 'server-only';
import { z } from 'zod';
import { Resend } from 'resend';
import { env, requireEnv } from '@/lib/env';
import { isDisposableEmail } from '@/lib/booking/disposableEmailDomains';
import { MIN_DWELL_MS } from '@/components/contact/ContactForm/contactConfig';
import ContactNotification from '@/emails/ContactNotification';

const ContactInput = z.object({
  name:         z.string().trim().min(1, 'Name is required').max(120),
  email:        z.string().trim().toLowerCase().email('Valid email required').max(254),
  message:      z.string().trim().min(1, 'Message is required').max(2000),
  website:      z.string().optional().default(''),
  formDwellMs:  z.number().finite().min(0).max(7 * 24 * 60 * 60 * 1000),
});

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: 'validation' | 'spam' | 'server'; message?: string };

export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = ContactInput.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      reason: 'validation',
      message: parsed.error.issues.map((i) => i.message).join('; '),
    };
  }
  const data = parsed.data;

  // Honeypot
  if (data.website && data.website.trim().length > 0) {
    console.warn('[contact] rejected: honeypot');
    return { ok: false, reason: 'spam' };
  }

  // Dwell-time floor
  if (data.formDwellMs < MIN_DWELL_MS) {
    console.warn('[contact] rejected: dwell');
    return { ok: false, reason: 'spam' };
  }

  // Disposable email blocklist
  if (isDisposableEmail(data.email)) {
    console.warn('[contact] rejected: disposable');
    return { ok: false, reason: 'spam' };
  }

  // Send email via Resend
  const emailSent = await sendContactEmail(data).catch((e) => {
    console.error('[contact] Resend failed', e);
    return false;
  });

  if (!emailSent) {
    return { ok: false, reason: 'server' };
  }

  return { ok: true };
}

type ContactData = z.infer<typeof ContactInput>;

async function sendContactEmail(data: ContactData): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.BOOKING_FROM_EMAIL) {
    console.warn('[contact] Resend env not configured — skipping email.');
    return false;
  }

  const resend = new Resend(requireEnv('RESEND_API_KEY'));
  const toEmail = env.BOOKING_HOST_EMAIL;

  const { error } = await resend.emails.send({
    from: `Digital Knight <${requireEnv('BOOKING_FROM_EMAIL')}>`,
    to: toEmail,
    subject: `New enquiry from ${data.name}`,
    replyTo: data.email,
    react: ContactNotification({
      name: data.name,
      email: data.email,
      message: data.message,
    }),
  });

  if (error) {
    console.error('[contact] Resend error', error);
    return false;
  }
  return true;
}
