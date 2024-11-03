import GymFlowLogo from '@/app/ui/gymflow-logo'; // Import your GYMFlow-specific logo
import ForgotPassword from '@/app/ui/forgot-password';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <GymFlowLogo />
          </div>
        </div>
        <ForgotPassword />
        <div className="flex justify-center">

          <p className="text-sm text-gray-600">
          Want to log in to your account?{' '}
            <Link href="/login" className="text-blue-500 underline">
              Login here
            </Link>
          </p>
        </div>
      </div>


    </main>
  );
}
