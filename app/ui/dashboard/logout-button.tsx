'use client';

import { PowerIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log('Starting logout process...');

      // Detect the current domain (local or deployed)
      const domain = window.location.hostname === 'localhost' ? '' : `.gym-dashboard-mu.vercel.app`;

      // Delete client-side cookies from different paths
      const paths = ['/', '/dashboard', '/members'];
      paths.forEach((path) => {
        document.cookie = `token=; path=${path}; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None`;
        console.log(`Cookie cleared from path: ${path}`);
      });

      // Also clear cookie with domain
      document.cookie = `token=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None`;
      console.log(`Cookie cleared with domain: ${domain}`);

      // Redirect to login page after logout
      window.location.replace('/login');
    } catch (error) {
      console.error('Error during sign out:', error);

      // Fallback cookie deletion
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
      console.log('Logout process completed.');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">{isLoading ? 'Signing Out...' : 'Sign Out'}</div>
    </button>
  );
}
