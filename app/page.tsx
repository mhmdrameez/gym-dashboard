"use client";

import { useEffect } from 'react';
import GymFlowLogo from '@/app/ui/gymflow-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard'); // Redirect to /dashboard on load
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col p-6 bg-gray-800">
      <div className="flex h-20 items-end rounded-lg bg-gray-900 p-4 md:h-52">
        <GymFlowLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-700 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${lusitana.className} text-xl text-gray-200 md:text-3xl`}>
            <strong>Welcome to GymFlow.</strong> Manage your gym with ease! Access user management, notifications, and more.
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Go to Dashboard</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/threadmill.jpg"
            width={1000}
            height={760}
            alt="Screenshots of the GYMFlow dashboard showing desktop version"
            className="hidden md:block"
          />
          <Image
            src="/threadmill.jpg"
            width={560}
            height={620}
            alt="Screenshot of the GYMFlow dashboard showing mobile version"
            className="block md:hidden"
          />
        </div>
      </div>
    </main>
  );
}
