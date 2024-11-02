// ErrorMessage.tsx
import React from 'react';
import { FieldError } from 'react-hook-form'; // Import FieldError

interface ErrorMessageProps {
  error?: FieldError | null; // Adjusted to accept FieldError
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error || !error.message) return null; // Check if error is defined and has a message
  return <p className="mt-1 text-sm text-red-500">{error.message}</p>;
};

export default ErrorMessage;
