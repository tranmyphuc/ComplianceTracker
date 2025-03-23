
import React from 'react';

interface RegistrationErrorProps {
  message?: string;
}

export const RegistrationError: React.FC<RegistrationErrorProps> = ({ 
  message = "There was an error registering your AI system. Please try again."
}) => {
  return (
    <div className="bg-red-500 text-white p-4 rounded-md mb-4">
      <h3 className="font-bold">Registration failed</h3>
      <p>{message}</p>
    </div>
  );
};
