import React from 'react';

export const Input = (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLInputElement> & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="border border-gray-300 py-2 px-4 rounded focus:outline-none focus:border-blue-500" />
);