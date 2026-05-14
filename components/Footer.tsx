import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-navy">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Persistent Momentum" width={30} height={30} className="h-7 w-auto" />
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Persistent Momentum
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-mid">
              We design, build, and ship mobile apps, web platforms, and AI-powered
              automation for your business.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="eyebrow mb-3">Company</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="text-mid transition-colors hover:text-white">Products</Link></li>
                <li><Link href="/careers" className="text-mid transition-colors hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="text-mid transition-colors hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-mid transition-colors hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-mid transition-colors hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-mid">&copy; {year} Persistent Momentum. All rights reserved.</p>
          <p className="font-mono text-xs text-mid/70">Built with pmOS.</p>
        </div>
      </div>
    </footer>
  );
}
