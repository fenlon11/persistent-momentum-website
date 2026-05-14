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

const inputClass =
  'w-full rounded-lg border border-white/10 bg-navy px-4 py-3 text-sm text-white placeholder-mid transition-colors focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric';

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
        message: "Thanks for reaching out — we'll get back to you soon.",
      });
      reset();
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-white/8 bg-navy-raised p-7 sm:p-8"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-glow">
            Name
          </label>
          <input id="name" type="text" {...register('name')} className={inputClass} placeholder="Your name" />
          {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-glow">
            Email
          </label>
          <input id="email" type="email" {...register('email')} className={inputClass} placeholder="you@company.com" />
          {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-glow">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            {...register('message')}
            className={`${inputClass} resize-none`}
            placeholder="Tell us what you're working on."
          />
          {errors.message && <p className="mt-2 text-sm text-red-400">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Sending…' : 'Send message'}
        </button>

        {submitStatus.type && (
          <div
            className={`rounded-lg border p-4 text-sm ${
              submitStatus.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/20 bg-red-500/10 text-red-300'
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </div>
    </form>
  );
}
