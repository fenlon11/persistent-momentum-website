import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Persistent Momentum',
  description:
    'Privacy policy for Persistent Momentum and persistentmomentum.com.',
};

export default function PrivacyPolicy() {
  const lastUpdated = '2026-05-15';

  return (
    <main className="min-h-screen bg-navy">
      {/* Header */}
      <section className="relative border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-3xl px-5 pb-12 pt-36 sm:px-8 sm:pt-44">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px flex-1 bg-white/12" />
            <span className="annotation-bright">Sheet E &middot; Legal &middot; Privacy</span>
          </div>
          <p className="annotation mt-12">Legal</p>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-mid">
            Last updated &middot; {lastUpdated}
          </p>
        </div>
      </section>

      {/* Body */}
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
                Persistent Momentum (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                &ldquo;us&rdquo;) is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website or
                interact with us.
              </p>
              <p>
                By accessing or using our services, you acknowledge that you
                have read, understood, and agree to be bound by this Privacy
                Policy.
              </p>
            </Intro>

            <Section num="01" title="Information we collect">
              <SubHeading>1.1 Personal information</SubHeading>
              <p>We collect information you provide directly, including:</p>
              <ul>
                <li>Name and contact information (email, phone, address)</li>
                <li>Company name and business information</li>
                <li>Communication preferences</li>
                <li>Anything else you provide through forms or messages</li>
              </ul>

              <SubHeading>1.2 Automatically collected</SubHeading>
              <p>When you access the site we may automatically collect:</p>
              <ul>
                <li>Device information (IP address, browser, OS)</li>
                <li>Usage data (pages viewed, links clicked, time on page)</li>
                <li>Approximate location from IP address</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <SubHeading>1.3 Third-party information</SubHeading>
              <p>
                If you connect a third-party account or interact with us
                through social platforms, we may receive your public profile
                information and email address from those platforms.
              </p>
            </Section>

            <Section num="02" title="How we use your information">
              <p>We use what we collect for these purposes:</p>
              <ul>
                <li>To provide, maintain, and improve our services</li>
                <li>To respond to your inquiries</li>
                <li>To send marketing emails, where you have opted in</li>
                <li>To personalize your experience</li>
                <li>To analyze usage and optimize the site</li>
                <li>To detect and prevent abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </Section>

            <Section num="03" title="How we share your information">
              <SubHeading>3.1 Service providers</SubHeading>
              <p>
                We may share information with third-party providers performing
                services on our behalf, including:
              </p>
              <ul>
                <li>Email and communication services</li>
                <li>Analytics and site optimization</li>
                <li>CRM systems</li>
                <li>Payment processing</li>
              </ul>

              <SubHeading>3.2 Business transfers</SubHeading>
              <p>
                If we are involved in a merger, acquisition, financing,
                reorganization, bankruptcy, or sale of assets, your information
                may transfer as part of that transaction.
              </p>

              <SubHeading>3.3 Legal requirements</SubHeading>
              <p>
                We may disclose your information if required by law or in
                response to valid government requests.
              </p>

              <SubHeading>3.4 With your consent</SubHeading>
              <p>
                We may share information with third parties when you give us
                explicit consent.
              </p>
            </Section>

            <Section num="04" title="Your rights and choices">
              <p>You have certain rights regarding your personal information:</p>
              <ul>
                <li>
                  <strong>Access</strong> &middot; request the personal
                  information we hold about you
                </li>
                <li>
                  <strong>Correction</strong> &middot; ask us to correct
                  inaccurate information
                </li>
                <li>
                  <strong>Deletion</strong> &middot; request that we delete
                  your personal information
                </li>
                <li>
                  <strong>Opt out</strong> &middot; unsubscribe from marketing
                  emails any time
                </li>
                <li>
                  <strong>Portability</strong> &middot; receive your data in a
                  structured format
                </li>
                <li>
                  <strong>Restriction</strong> &middot; ask us to restrict
                  processing
                </li>
              </ul>
              <p>
                To exercise any of these rights, email{' '}
                <a
                  href="mailto:info@persistentmomentum.com"
                  className="text-electric underline-offset-4 hover:underline"
                >
                  info@persistentmomentum.com
                </a>{' '}
                or call (407) 801-2515.
              </p>
            </Section>

            <Section num="05" title="Cookies and tracking">
              <p>
                We use cookies and similar tracking technologies. You can
                instruct your browser to refuse cookies or warn you when one is
                sent. Some portions of the site may not work without cookies.
              </p>
            </Section>

            <Section num="06" title="Data security">
              <p>
                We implement reasonable technical and organizational security
                measures to protect your information. No method of transmission
                over the internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </Section>

            <Section num="07" title="Data retention">
              <p>
                We retain personal information for as long as necessary to
                fulfill the purposes outlined in this Privacy Policy, unless a
                longer retention period is required or permitted by law.
              </p>
            </Section>

            <Section num="08" title="Children's privacy">
              <p>
                Our services are not directed to individuals under 18. We do
                not knowingly collect personal information from children. If
                you believe a child has provided us information, contact us and
                we will delete it.
              </p>
            </Section>

            <Section num="09" title="Third-party websites">
              <p>
                Our site may link to third-party websites that we do not
                operate. We assume no responsibility for their content or
                privacy practices. Review their privacy policies before
                providing information.
              </p>
            </Section>

            <Section num="10" title="International data transfers">
              <p>
                Your information may be transferred to and maintained on
                computers in jurisdictions whose data protection laws may
                differ from yours. By providing information, you consent to
                that transfer.
              </p>
            </Section>

            <Section num="11" title="Changes to this policy">
              <p>
                We may update this Privacy Policy from time to time. We will
                post the new version on this page and update the &ldquo;Last
                updated&rdquo; date.
              </p>
            </Section>

            <Section num="12" title="Contact us" last>
              <p>
                Questions about this Privacy Policy? Reach out via{' '}
                <Link
                  href="/contact"
                  className="text-electric underline-offset-4 hover:underline"
                >
                  the contact page
                </Link>{' '}
                or directly:
              </p>
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

/* ───────────────────── Local helpers ───────────────────── */

function Intro({ children }: { children: React.ReactNode }) {
  return (
    <div className="legal-prose space-y-4 text-glow/85">{children}</div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 text-base font-semibold text-white">{children}</h3>
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
