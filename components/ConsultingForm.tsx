'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { COMPANY_SIZES, INTRO_CALL_URL, NEEDS, SUCCESS_MESSAGE, inquirySchema } from '@/lib/consulting';

// Consulting inquiry form (fenlon11/pmOS#683). Posts to /api/consulting, which validates with the
// same schema.
const formSchema = inquirySchema.omit({ pageUri: true, pageName: true });
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const fieldShell = 'w-full px-4 py-3 text-base transition-colors focus:outline-none';

const fieldStyle = {
  background: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-dark)',
  borderRadius: 'var(--radius)',
};

const labelClass = 'mb-2 block text-sm font-medium';
const labelStyle = { color: 'var(--color-text-dark)' };

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-red-600">{message}</p> : null;
}

export default function ConsultingForm() {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (data: FormOutput) => {
    setStatus({ type: null, message: '' });
    try {
      const response = await fetch('/api/consulting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, pageUri: window.location.href, pageName: document.title }),
      });
      const result = await response.json();
      if (!response.ok) {
        for (const [name, message] of Object.entries((result.fields ?? {}) as Record<string, string>)) {
          if (name in formSchema.shape) setError(name as keyof FormInput, { message });
        }
        throw new Error(result.error || 'Something went wrong.');
      }
      setStatus({ type: 'success', message: SUCCESS_MESSAGE });
      reset();
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Something went wrong. Email info@persistentmomentum.com.',
      });
    }
  };

  // HubSpot's collected-forms script skips forms marked data-hs-do-not-collect. This form already posts to
  // HubSpot's forms API, so capturing it too counted each signup twice and set the contact to lead (2026-10-22).
  return (
    <form
      id="inquiry"
      data-hs-do-not-collect="true"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="p-6 sm:p-8"
      style={{
        background: 'var(--color-bg-light-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstname" className={labelClass} style={labelStyle}>
              First name
            </label>
            <input id="firstname" autoComplete="given-name" {...register('firstname')} className={fieldShell} style={fieldStyle} />
            <FieldError message={errors.firstname?.message} />
          </div>
          <div>
            <label htmlFor="lastname" className={labelClass} style={labelStyle}>
              Last name
            </label>
            <input id="lastname" autoComplete="family-name" {...register('lastname')} className={fieldShell} style={fieldStyle} />
            <FieldError message={errors.lastname?.message} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass} style={labelStyle}>
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={fieldShell}
            style={fieldStyle}
            placeholder="you@company.com"
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="company" className={labelClass} style={labelStyle}>
              Company
            </label>
            <input id="company" autoComplete="organization" {...register('company')} className={fieldShell} style={fieldStyle} />
            <FieldError message={errors.company?.message} />
          </div>
          <div>
            <label htmlFor="role" className={labelClass} style={labelStyle}>
              Role <span style={{ color: 'var(--color-text-dark-muted)' }}>(optional)</span>
            </label>
            <input id="role" autoComplete="organization-title" {...register('role')} className={fieldShell} style={fieldStyle} />
            <FieldError message={errors.role?.message} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="companySize" className={labelClass} style={labelStyle}>
              Company size
            </label>
            <select id="companySize" defaultValue="" {...register('companySize')} className={fieldShell} style={fieldStyle}>
              <option value="" disabled>
                Employees
              </option>
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <FieldError message={errors.companySize?.message} />
          </div>
          <div>
            <label htmlFor="need" className={labelClass} style={labelStyle}>
              What you need
            </label>
            <select id="need" defaultValue="" {...register('need')} className={fieldShell} style={fieldStyle}>
              <option value="" disabled>
                Choose one
              </option>
              {Object.entries(NEEDS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FieldError message={errors.need?.message} />
          </div>
        </div>

        <div>
          <label htmlFor="message" className={labelClass} style={labelStyle}>
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            {...register('message')}
            className={`${fieldShell} resize-none`}
            style={fieldStyle}
            placeholder="What do you want to fix or build?"
          />
          <FieldError message={errors.message?.message} />
        </div>

        {/* Honeypot: hidden from people and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
        </div>

        <p className="text-sm" style={{ color: 'var(--color-text-dark-muted)' }}>
          We use what you send only to reply to your inquiry. See our{' '}
          <Link href="/privacy" className="underline underline-offset-4" style={{ color: 'var(--color-primary)' }}>
            privacy policy
          </Link>
          .
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 text-base font-semibold py-3.5 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius)' }}
        >
          {isSubmitting ? 'Sending…' : 'Send inquiry'}
          {!isSubmitting && <span aria-hidden>→</span>}
        </button>

        {status.type && (
          <div
            role="status"
            className="p-4 text-sm"
            style={{
              background: status.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(220, 38, 38, 0.08)',
              border:
                status.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(220, 38, 38, 0.3)',
              color: status.type === 'success' ? 'rgb(6, 95, 70)' : 'rgb(153, 27, 27)',
              borderRadius: 'var(--radius)',
            }}
          >
            {status.message}
            {status.type === 'success' && (
              <>
                {' '}
                Want to talk sooner?{' '}
                <a href={INTRO_CALL_URL} className="underline underline-offset-4">
                  Book a 30-minute intro call
                </a>
                .
              </>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
