import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — Persistent Momentum',
  description:
    'Terms of service for Persistent Momentum and persistentmomentum.com.',
};

export default function TermsOfService() {
  const lastUpdated = '2026-05-15';

  return (
    <main className="min-h-screen bg-navy">
      <section className="relative border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-3xl px-5 pb-12 pt-36 sm:px-8 sm:pt-44">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px flex-1 bg-white/12" />
            <span className="annotation-bright">Sheet F &middot; Legal &middot; Terms</span>
          </div>
          <p className="annotation mt-12">Legal</p>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-mid">
            Last updated &middot; {lastUpdated}
          </p>
        </div>
      </section>

      <section className="pb-28 pt-12">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="relative border border-white/12 bg-navy-raised p-7 sm:p-10">
            <span
              aria-hidden
              className="absolute left-0 top-0 h-3 w-3 border-l border-t border-electric/60"
            />
            <span
              aria-hidden
              className="absolute right-0 bottom-0 h-3 w-3 border-b border-r border-electric/60"
            />

            <Intro>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access
                to and use of the website and services provided by Persistent
                Momentum (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                &ldquo;us&rdquo;). By accessing or using our services, you
                agree to be bound by these Terms.
              </p>
              <p>
                If you do not agree to these Terms, you may not access or use
                our services.
              </p>
            </Intro>

            <Section num="01" title="Acceptance of terms">
              <p>By accessing or using the site you represent that:</p>
              <ul>
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>The information you provide is accurate and complete</li>
              </ul>
            </Section>

            <Section num="02" title="Description of services">
              <p>
                Persistent Momentum is a portfolio operator that designs,
                builds, and ships mobile apps, web platforms, and AI-powered
                automation. Our products are sold a la carte through their own
                product brands and websites. The corporate site at{' '}
                <Link
                  href="/"
                  className="text-electric underline-offset-4 hover:underline"
                >
                  persistentmomentum.com
                </Link>{' '}
                is a holdco surface for investors, partners, talent, and press.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any
                aspect of our services at any time without prior notice.
              </p>
            </Section>

            <Section num="03" title="User responsibilities">
              <p>When using our services, you agree not to:</p>
              <ul>
                <li>Provide false, inaccurate, or misleading information</li>
                <li>Use the services for any unlawful purpose</li>
                <li>Interfere with or disrupt the services or servers</li>
                <li>Attempt to gain unauthorized access to any portion of the services</li>
                <li>Use automated systems to access the services without permission</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or store personal data about other users</li>
              </ul>
            </Section>

            <Section num="04" title="Intellectual property">
              <p>
                All content, features, and functionality of our services —
                text, graphics, logos, images, software, and design — are owned
                by Persistent Momentum or our licensors and are protected by
                intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative
                works of, publicly display, republish, download, store, or
                transmit any of our content without our prior written consent,
                except as necessary for your authorized use of the services.
              </p>
            </Section>

            <Section num="05" title="Disclaimers">
              <p>
                THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
                AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED, INCLUDING:
              </p>
              <ul>
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Warranties that the services will be uninterrupted, secure, or error-free</li>
                <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
              </ul>
              <p>
                We do not warrant that the services will meet your
                requirements. Your use of the services is at your sole risk.
              </p>
            </Section>

            <Section num="06" title="Limitation of liability">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PERSISTENT MOMENTUM
                SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING:
              </p>
              <ul>
                <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                <li>Damages from your access to or use of (or inability to access or use) the services</li>
                <li>Damages from any conduct or content of third parties</li>
                <li>Unauthorized access, use, or alteration of your content</li>
              </ul>
              <p>
                Our total liability for all claims arising out of or relating
                to these Terms or the services shall not exceed the amount you
                paid us, if any, during the twelve months prior to the claim,
                or $100, whichever is greater.
              </p>
            </Section>

            <Section num="07" title="Indemnification">
              <p>
                You agree to indemnify, defend, and hold harmless Persistent
                Momentum and its officers, directors, employees, contractors,
                agents, and affiliates from any claims, liabilities, damages,
                losses, costs, expenses, or fees (including reasonable
                attorneys&apos; fees) arising from:
              </p>
              <ul>
                <li>Your use of or access to the services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any content you submit or transmit through the services</li>
              </ul>
            </Section>

            <Section num="08" title="Termination">
              <p>
                We reserve the right to suspend or terminate your access to
                the services at any time, with or without cause and notice,
                including if:
              </p>
              <ul>
                <li>You breach these Terms</li>
                <li>We are required to do so by law</li>
                <li>We decide to discontinue the services</li>
              </ul>
              <p>
                Sections that by their nature should survive termination
                (intellectual property, disclaimers, limitations of liability)
                shall survive.
              </p>
            </Section>

            <Section num="09" title="Governing law">
              <p>
                These Terms shall be governed by the laws of the United
                States, without regard to conflict of law provisions.
              </p>
              <p>
                Any disputes shall be resolved through binding arbitration in
                accordance with the rules of the American Arbitration
                Association, except that either party may seek injunctive or
                other equitable relief in any court of competent jurisdiction.
              </p>
            </Section>

            <Section num="10" title="Changes to these terms">
              <p>
                We may modify these Terms at any time. We will post the new
                Terms on this page and update the &ldquo;Last updated&rdquo;
                date. Your continued use after changes become effective
                constitutes acceptance of the revised Terms.
              </p>
            </Section>

            <Section num="11" title="Severability and waiver">
              <p>
                If any provision of these Terms is unenforceable or invalid,
                that provision will be limited or eliminated to the minimum
                extent necessary; the rest of the Terms remain in effect.
              </p>
              <p>
                Our failure to enforce any right or provision will not be
                deemed a waiver.
              </p>
            </Section>

            <Section num="12" title="Entire agreement">
              <p>
                These Terms, together with our{' '}
                <Link
                  href="/privacy"
                  className="text-electric underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                , constitute the entire agreement between you and Persistent
                Momentum concerning the services.
              </p>
            </Section>

            <Section num="13" title="Contact us" last>
              <p>Questions about these Terms?</p>
              <div className="mt-4 border border-white/12 bg-navy p-5">
                <p className="font-semibold text-white">Persistent Momentum</p>
                <p className="mt-2 text-sm text-mid">
                  Email:{' '}
                  <a
                    href="mailto:info@persistentmomentum.com"
                    className="text-electric underline-offset-4 hover:underline"
                  >
                    info@persistentmomentum.com
                  </a>
                </p>
                <p className="text-sm text-mid">
                  Phone:{' '}
                  <a
                    href="tel:+14078012515"
                    className="text-electric underline-offset-4 hover:underline"
                  >
                    (407) 801-2515
                  </a>
                </p>
              </div>
            </Section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Intro({ children }: { children: React.ReactNode }) {
  return (
    <div className="legal-prose space-y-4 text-glow/85">{children}</div>
  );
}

function Section({
  num,
  title,
  last = false,
  children,
}: {
  num: string;
  title: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={last ? 'mt-12' : 'mt-12'}>
      <header className="mb-5 flex items-baseline gap-4">
        <span className="font-mono text-xs tracking-widest text-electric">
          {num}
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
      </header>
      <div className="legal-prose space-y-3 text-glow/85">{children}</div>
    </section>
  );
}
