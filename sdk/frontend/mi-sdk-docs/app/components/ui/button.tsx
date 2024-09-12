import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    // Add other props here if needed
}

export const Button = ({ children, ...props }: ButtonProps) => (
    <button {...props} className="bg-primary hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        {children}
    </button>
);