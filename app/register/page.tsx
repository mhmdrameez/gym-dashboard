import GymFlowLogo from '@/app/ui/gymflow-logo'; // Import your GYMFlow-specific logo
import RegisterForm from '@/app/ui/register-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-4 rounded-lg bg-white shadow-lg p-6 md:p-8">
        <div className="flex items-end justify-center rounded-lg bg-blue-500 p-4">
          <div className="w-32 text-white md:w-36">
            <GymFlowLogo />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-center text-gray-800 md:text-3xl">Register</h1>
        <RegisterForm />
      
        <div className="flex justify-center">

        <p className="text-sm text-gray-600">
            Already account?{' '}
            <Link href="/login" className="text-blue-500 underline">
              Login here
            </Link>
          </p>
          </div>

        <div className="flex justify-center">
          <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

      </div>
    </main>
  );
}
