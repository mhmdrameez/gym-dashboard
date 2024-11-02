'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [step, setStep] = useState<number>(1); // Step 1: Email, Step 2: OTP, Step 3: Reset Password
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);


    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    
      const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
      };

  // Step 1: Send Forgot Password Email
  const handleSendEmail = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await axios.post(
        'https://fitbilsass.onrender.com/users/forgot_password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setStep(2); // Move to OTP verification step
    } catch (error) {
      setErrorMessage('Failed to send forgot password email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpVerification = async () => {
    setIsLoading(true);
    setErrorMessage('');
    if (!otp || isNaN(Number(otp)) || otp.length !== 4) {
      setErrorMessage('Please enter a valid 4-digit OTP.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://fitbilsass.onrender.com/users/verify_forgot_otp',
        { otp , email },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token || '', // Include token if available
          },
        }
      );


      if (response.data.data.reset_token) {
        setToken(response.data.data.reset_token); // Store token for password reset
        setStep(3); // Move to reset password step
      } else {
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setErrorMessage('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handlePasswordReset = async () => {
    setIsLoading(true);
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        'https://fitbilsass.onrender.com/users/reset_password',
        {
          email,
          token,
          password: newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token || '',
          },
        }
      );
      router.push('/login'); // Redirect to login after successful reset
    } catch (error) {
      setErrorMessage('Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl mb-4">
        {step === 1 && 'Forgot Password'}
        {step === 2 && 'Enter OTP'}
        {step === 3 && 'Reset Password'}
      </h2>

      {step === 1 && (
        <div className="w-full max-w-xs">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-3 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSendEmail}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isLoading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-xs">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="mb-3 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleOtpVerification}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

{step === 3 && (
        <div className="w-full max-w-xs">
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="relative mb-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            onClick={handlePasswordReset}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      )}

      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
    </div>
  );
}
