import AcmeLogo from '@/app/ui/acme-logo';
import RegisterForm from '@/app/ui/register-form';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-4 rounded-lg bg-white shadow-lg p-6 md:p-8">
        <div className="flex items-end justify-center rounded-lg bg-blue-500 p-4">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-center text-gray-800 md:text-3xl">Login</h1>
        <RegisterForm />
        <div className="flex justify-center">
          <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
        </div>
      </div>
    </main>
  );
}
