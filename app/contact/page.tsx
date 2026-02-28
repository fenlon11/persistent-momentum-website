'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Footer from '@/components/Footer';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  serviceInterest: z.enum(['sales', 'operations', 'both']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  smsConsent: z.boolean(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
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
    defaultValues: {
      smsConsent: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setSubmitStatus({
        type: 'success',
        message:
          'Thank you for your inquiry! We will get back to you within 24 hours.',
      });
      reset();
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#3E8BF5]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#3E8BF5]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3E8BF5]/10 border border-[#3E8BF5]/20 backdrop-blur-sm mb-6">
              <span className="text-sm text-[#3E8BF5] font-medium">Get in Touch</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              Contact <span className="text-[#3E8BF5]">Us</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Let&apos;s discuss how automation can transform your business operations
            </p>
          </div>

          {/* Direct Contact Information */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {/* Email Card */}
            <a
              href="mailto:info@persistentmomentum.com"
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 hover:border-[#3E8BF5]/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#3E8BF5]/10 rounded-xl flex items-center justify-center group-hover:bg-[#3E8BF5]/20 transition-colors">
                  <svg className="w-6 h-6 text-[#3E8BF5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                  <p className="text-[#3E8BF5] group-hover:text-[#3E8BF5]/80 transition-colors">
                    info@persistentmomentum.com
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href="tel:+14078012515"
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 hover:border-[#3E8BF5]/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#3E8BF5]/10 rounded-xl flex items-center justify-center group-hover:bg-[#3E8BF5]/20 transition-colors">
                  <svg className="w-6 h-6 text-[#3E8BF5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                  <p className="text-[#3E8BF5] group-hover:text-[#3E8BF5]/80 transition-colors">
                    (407) 801-2515
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Monday - Friday, 9am - 5pm EST
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative py-16 pb-32">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Send Us a <span className="text-[#3E8BF5]">Message</span>
            </h2>
            <p className="text-slate-400">
              Fill out the form below and we&apos;ll get back to you as soon as possible
            </p>
          </div>

          {/* Form Container */}
          <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 sm:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Grid layout for name/email */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Name <span className="text-[#3E8BF5]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#3E8BF5] focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email <span className="text-[#3E8BF5]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#3E8BF5] focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Grid layout for phone/company */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number <span className="text-[#3E8BF5]">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#3E8BF5] focus:border-transparent transition-all"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-400">{errors.phone.message}</p>
                  )}
                </div>

                {/* Company Field (Optional) */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                    Company <span className="text-slate-500 text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    {...register('company')}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#3E8BF5] focus:border-transparent transition-all"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              {/* Service Interest */}
              <div>
                <label
                  htmlFor="serviceInterest"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Service Interest <span className="text-[#3E8BF5]">*</span>
                </label>
                <select
                  id="serviceInterest"
                  {...register('serviceInterest')}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-[#3E8BF5] focus:border-transparent transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value="" className="bg-slate-900">Select a service</option>
                  <option value="sales" className="bg-slate-900">Sales Automation</option>
                  <option value="operations" className="bg-slate-900">Operations Automation</option>
                  <option value="both" className="bg-slate-900">Both Services</option>
                </select>
                {errors.serviceInterest && (
                  <p className="mt-2 text-sm text-red-400">{errors.serviceInterest.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message <span className="text-[#3E8BF5]">*</span>
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#3E8BF5] focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your automation needs..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-400">{errors.message.message}</p>
                )}
              </div>

              {/* A2P Compliant SMS Opt-in */}
              <div className="relative bg-[#3E8BF5]/5 border border-[#3E8BF5]/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    id="smsConsent"
                    {...register('smsConsent')}
                    className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-900/50 text-[#3E8BF5] focus:ring-2 focus:ring-[#3E8BF5] focus:ring-offset-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="smsConsent" className="text-sm text-slate-300 cursor-pointer leading-relaxed">
                      I consent to receive text messages from Persistent Momentum at the phone
                      number provided. Message frequency varies. Reply STOP to opt-out at any time.
                      Message and data rates may apply.
                    </label>
                    <p className="mt-3 text-xs text-slate-500">
                      By providing your phone number and checking this box, you agree to receive text
                      messages from Persistent Momentum. Review our{' '}
                      <a href="/privacy" className="text-[#3E8BF5] hover:text-[#3E8BF5]/80 transition-colors">
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a href="/terms" className="text-[#3E8BF5] hover:text-[#3E8BF5]/80 transition-colors">
                        Terms of Service
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full px-8 py-4 bg-[#3E8BF5] text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#3E8BF5]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Inquiry
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-[#3E8BF5]/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Status Messages */}
              {submitStatus.type && (
                <div
                  className={`p-4 rounded-2xl border ${
                    submitStatus.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {submitStatus.type === 'success' ? (
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <p className="text-sm">{submitStatus.message}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
