'use client';

import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log('Starting logout process...');

      // Call API to handle logout
      const response = await fetch('/api/logout', { method: 'POST' });
      
      if (response.ok) {
        console.log('Logout successful, deleting cookies...');
        
        // Delete client-side cookies from different paths
        const paths = ['/', '/dashboard', '/members'];
        paths.forEach((path) => {
          document.cookie = `token=; path=${path}; domain=.gym-dashboard-mu.vercel.app; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None`;
          console.log(`Cookie cleared from path: ${path}`);
        });
        
        // Additional cookie deletion with domain
        document.cookie = `token=; path=/; domain=.gym-dashboard-mu.vercel.app; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None`;
        console.log('Cookie cleared with domain: gym-dashboard-mu.vercel.app');

        // Redirect to login page
        window.location.replace('/login');
      } else {
        throw new Error('Logout failed');
      }
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
