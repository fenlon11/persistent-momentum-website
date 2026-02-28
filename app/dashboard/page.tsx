'use client';

import { useState, useEffect } from 'react';
import DashboardLogin from '@/components/DashboardLogin';
import DashboardContent from '@/components/DashboardContent';

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  function handleLogout() {
    document.cookie = 'dashboard_session=; path=/; max-age=0';
    setAuthenticated(false);
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3E8BF5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <DashboardLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <DashboardContent onLogout={handleLogout} />;
}
