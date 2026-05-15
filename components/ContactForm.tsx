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
  'w-full border border-white/12 bg-navy px-4 py-3 text-sm text-white placeholder-mid transition-colors focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric';

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative border border-white/12 bg-navy-raised p-6 sm:p-8"
    >
      {/* corner ticks */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-3 w-3 border-l border-t border-electric/60"
      />
      <span
        aria-hidden
        className="absolute right-0 bottom-0 h-3 w-3 border-b border-r border-electric/60"
      />

      <p className="annotation-bright mb-6">Message form</p>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="annotation mb-2 block">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={fieldShell}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="annotation mb-2 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={fieldShell}
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="annotation mb-2 block">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            {...register('message')}
            className={`${fieldShell} resize-none`}
            placeholder="Investors, partners, talent, press — what brings you here?"
          />
          {errors.message && (
            <p className="mt-2 text-sm text-red-400">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex w-full items-center justify-center gap-2 bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Sending…' : 'Send message'}
          {!isSubmitting && (
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          )}
        </button>

        {submitStatus.type && (
          <div
            role="status"
            className={`border p-4 text-sm ${
              submitStatus.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/8 text-emerald-300'
                : 'border-red-500/30 bg-red-500/8 text-red-300'
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </div>
    </form>
  );
}
