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
      <div className="flex min-h-screen items-center justify-center bg-navy">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-electric border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return <DashboardLogin onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <DashboardContent onLogout={handleLogout} />;
}
