'use client';

import { useState } from 'react';
import axios from 'axios';
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  UserCircleIcon,
  PhoneIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from "next/navigation"; // Ensure correct import
import Link from 'next/link';

// Define Zod schema for form validation
const formSchema = z.object({
  first_name: z.string().min(1, { message: "First Name is required" }),
  last_name: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email("Invalid email address!"),
  phone: z.string().length(10, { message: "Phone Number must be exactly 10 digits" }).regex(/^\d{10}$/, { message: "Phone Number must be numeric" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirm_password: z.string().min(8, { message: "Confirm Password is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  gym_name: z.string().min(1, { message: "Gym Center Name is required" }),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export default function RegistrationForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpModalIsOpen, setOtpModalIsOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const requestBody = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      phone: data.phone,
      address: data.address,
      gym_name: data.gym_name,
    };

    try {
      setIsSubmitting(true); // Show loader

      // Make registration request
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, requestBody);
      console.log('Registration successful:', response.data);

      // Check if the response contains the expected properties
      if (response.data && response.data.succes && response.data.data && response.data.data.access) {
        setErrorMessage(null);

        const accessToken = response.data.data.access['x-access-token'];
        if (accessToken) {
          setAccessToken(accessToken);
          setOtpModalIsOpen(true);
        } else {
          setErrorMessage("Access token not received. Please try again.");
        }
      } else {
        setErrorMessage("Registration failed. Please check your details.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data.message || "An error occurred. Please try again.";
        console.error('Server error:', serverMessage);
        setErrorMessage(serverMessage);
      } else {
        console.error('Unexpected error:', error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Hide loader
    }
  };


  const [otp, setOtp] = useState('');

  const handleOtpChange = (e: any) => {
    setOtp(e.target.value);
    setErrorMessage(''); // Clear error message on input change
  };

  const verifyOtp = async () => {
    setIsVerifying(true); // Show loader
    try {
      // Add your OTP verification code here...
      await handleVerifyOtp(otp); // Assuming handleVerifyOtp is an async function
    } finally {
      setIsVerifying(false); // Hide loader
    }
  };

  const handleVerifyOtp = async (otp: any) => {
    if (!otp || isNaN(otp) || otp.toString().length !== 4) {
      setErrorMessage("Please enter a valid 4-digit OTP."); // Adjust length as per your OTP requirement
      return;
    }

    console.log('Verifying OTP:', otp);

    try {
      const response = await axios.post(`https://fitbilsass.onrender.com/users/verify_otp`, {
        otp: otp,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
        }
      });

      console.log('OTP verification response:', response);

      if (response?.data?.status === true) {
        setErrorMessage(""); // Clear any existing error messages
        setSuccessMessage("OTP verified successfully! Redirecting to login..."); // Show success message

        // Close OTP modal and redirect to login after 3 seconds
        setTimeout(() => {
          setOtpModalIsOpen(false); // Close OTP modal
          router.push("/login"); // Redirect to login
        }, 1000); // 3000 ms = 3 seconds
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error('OTP verification error:', error);

      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data.message;

        // Specific server error handling
        if (serverMessage) {
          if (serverMessage.includes("Invalid passcode")) {
            setErrorMessage("The OTP you entered is incorrect. Please check and try again.");
          } else {
            setErrorMessage(serverMessage); // Display server message if available
          }
        } else {
          setErrorMessage("OTP verification failed. Please try again."); // Generic fallback
        }
      } else {
        setErrorMessage("An unexpected error occurred during OTP verification. Please try again.");
      }
    }
  };








  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Create an account
          </h1>

          {/* First Name */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="first_name">
              First Name
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${errors.first_name ? 'border-red-500' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="first_name"
                type="text"
                {...register('first_name', { required: true })}
                placeholder="Enter your first name"
                required
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* {errors.first_name && (
              <p className="mt-1 text-sm text-red-500">{errors.first_name.message}</p>
            )} */}
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="last_name">
              Last Name
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${errors.last_name ? 'border-red-500' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="last_name"
                type="text"
                {...register('last_name', { required: true })}
                placeholder="Enter your last name"
                required
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* {errors.last_name && (
              <p className="mt-1 text-sm text-red-500">{errors.last_name.message}</p>
            )} */}
          </div>

          {/* Email */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="email"
                type="email"
                {...register('email', { required: true })}
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )} */}
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="phone"
                type="text"
                {...register('phone', { required: true })}
                placeholder="Enter your phone number"
                required
                maxLength={10}
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )} */}
          </div>

          {/* Password */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="password"
                type="password"
                {...register('password', { required: true })}
                placeholder="Create a password"
                required
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )} */}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="confirm_password">
              Confirm Password
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${errors.confirm_password ? 'border-red-500' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="confirm_password"
                type="password"
                {...register('confirm_password', { required: true })}
                placeholder="Confirm your password"
                required
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-500">{errors.confirm_password.message}</p>
            )} */}
          </div>

          {/* Address */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="address">
              Address
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${errors.address ? 'border-red-500' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="address"
                type="text"
                {...register('address', { required: true })}
                placeholder="Enter your address"
                required
              />
              <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
            )} */}
          </div>

          {/* Gym Center Name */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="gym_name">
              Gym Center Name
            </label>
            <div className="relative">
              <input
                className={`peer block w-full rounded-md border ${errors.gym_name ? 'border-red-500' : 'border-gray-200'} py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500`}
                id="gym_name"
                type="text"
                {...register('gym_name', { required: true })}
                placeholder="Enter your gym center name"
                required
              />
              <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {/* {errors.gym_name && (
              <p className="mt-1 text-sm text-red-500">{errors.gym_name.message}</p>
            )} */}
          </div>
        </div>

        {/* Display error message if it exists */}
        {errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}



        {successMessage && (
          <p className="mt-1 text-sm text-green-500">{successMessage}</p>
        )}

        {/* Submit Button */}
        <Button
        type="submit"
        disabled={isSubmitting}
        className="group custom-button relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md px-6 py-4"
      >
        {isSubmitting ? (
          <span className="loader"></span>
        ) : (
          <span className="text-sm font-medium">Create an account</span>
        )}
      </Button>
      </form>

      {/* Custom OTP Modal */}
      {otpModalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl mb-4">Verify OTP</h2>
            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
            <input
              type="text"
              placeholder="Enter OTP"
              className="border rounded p-2 w-full mb-4"
              value={otp}
              onChange={handleOtpChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  verifyOtp();
                }
              }}
              inputMode="numeric" // Optimizes for numeric keypad on mobile
              pattern="[0-9]*"   // Allows only numeric input
              maxLength={4}
              onInput={(e) => {
                const input = e.target as HTMLInputElement; // Cast e.target to HTMLInputElement
                input.value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
              }}
            />

            <div className="flex justify-between">
              <button
                onClick={verifyOtp}
                className="bg-blue-500 text-white rounded px-4 py-2 flex items-center justify-center"
                disabled={isVerifying} // Disable button while verifying
              >
                {isVerifying ? (
                  <span className="loader"></span> // Loader appears while verifying
                ) : (
                  "Verify OTP"
                )}
              </button>
              <button onClick={() => setOtpModalIsOpen(false)} className="text-red-500">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

}
