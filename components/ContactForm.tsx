'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const fieldShell =
  'w-full px-4 py-3 text-sm transition-colors focus:outline-none';

const fieldStyle = {
  background: 'var(--color-bg-light-card)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-dark)',
  borderRadius: 'var(--radius)',
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setSubmitStatus({
        type: 'success',
        message: "Thanks — we'll get back to you within 24 hours.",
      });
      reset();
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Try us at info@persistentmomentum.com.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelStyle = {
    color: 'var(--color-text-dark)',
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-7 sm:p-8"
      style={{
        background: 'var(--color-bg-light-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
            style={labelStyle}
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={fieldShell}
            style={fieldStyle}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
            style={labelStyle}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={fieldShell}
            style={fieldStyle}
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium"
            style={labelStyle}
          >
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            {...register('message')}
            className={`${fieldShell} resize-none`}
            style={fieldStyle}
            placeholder="Investors, partners, talent, press — what brings you here?"
          />
          {errors.message && (
            <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 text-base font-semibold py-3.5 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: 'var(--color-primary)',
            borderRadius: 'var(--radius)',
          }}
        >
          {isSubmitting ? 'Sending…' : 'Send message'}
          {!isSubmitting && <span aria-hidden>→</span>}
        </button>

        {submitStatus.type && (
          <div
            role="status"
            className="p-4 text-sm"
            style={{
              background:
                submitStatus.type === 'success'
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(220, 38, 38, 0.08)',
              border:
                submitStatus.type === 'success'
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(220, 38, 38, 0.3)',
              color:
                submitStatus.type === 'success'
                  ? 'rgb(6, 95, 70)'
                  : 'rgb(153, 27, 27)',
              borderRadius: 'var(--radius)',
            }}
          >
            {submitStatus.message}
          </div>
        )}
      </div>
    </form>
  );
}
