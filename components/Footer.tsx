export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Persistent Momentum" className="w-10 h-10" />
            <h3 className="text-xl font-bold">
              <span className="text-white">Persistent</span>
              <span className="text-[#3E8BF5]"> Momentum</span>
            </h3>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a href="/privacy" className="text-slate-400 hover:text-[#3E8BF5] transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-slate-400 hover:text-[#3E8BF5] transition-colors">
              Terms
            </a>
            <a href="#contact" className="text-slate-400 hover:text-[#3E8BF5] transition-colors">
              Contact
            </a>
          </div>

          <p className="text-sm text-slate-500 italic">
            Built with AI. Shipped with purpose.
          </p>

          <p className="text-sm text-slate-600">
            &copy; {currentYear} Persistent Momentum
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3E8BF5]/50 to-transparent"></div>
    </footer>
  );
}
