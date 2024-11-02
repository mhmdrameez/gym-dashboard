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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, requestBody);
      console.log('Registration successful:', response.data);
      setErrorMessage(null); // Clear any existing error messages on success

      setTimeout(() => {
        router.push("/login"); // Redirect to home or another page
      }, 1000);
      // You can also navigate or perform any actions upon successful registration here
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Error response from server
          const serverMessage = error.response.data.message || "An error occurred. Please try again.";
          setErrorMessage(serverMessage); // Set error message from server
        } else {
          // The request was made but no response was received
          setErrorMessage("No response received from server. Please try again later.");
        }
      } else {
        // Fallback for unexpected errors
        setErrorMessage("An unexpected error occurred."); 
      }
      // console.error('Registration error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Create an account
        </h1>

      

        {/* First Name */}
        <div>
          <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="first_name">First Name</label>
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
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-500">{(errors.first_name as any).message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="last_name">Last Name</label>
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
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-500">{(errors.last_name as any).message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">Email</label>
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
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{(errors.email as any).message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="phone">Phone Number</label>
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
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{(errors.phone as any).message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">Password</label>
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{(errors.password as any).message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="confirm_password">Confirm Password</label>
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
          {errors.confirm_password && (
            <p className="mt-1 text-sm text-red-500">{(errors.confirm_password as any).message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="address">Address</label>
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
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{(errors.address as any).message}</p>
          )}
        </div>

        {/* Gym Center Name */}
        <div>
          <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="gym_name">Gym Center Name</label>
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
          {errors.gym_name && (
            <p className="mt-1 text-sm text-red-500">{(errors.gym_name as any).message}</p>
          )}
        </div>
      </div>


        {/* Display error message if it exists */}
        {errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}

      {/* Submit Button */}
      <Button type="submit" className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md border-2 border-gray-200 bg-gray-50 px-6 py-4 text-gray-600 transition hover:border-gray-300 hover:bg-gray-200 hover:text-gray-700">
        <span className="text-sm font-medium">Create an account</span>
        <ArrowRightIcon className="h-5 w-5 text-gray-600 transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
}
