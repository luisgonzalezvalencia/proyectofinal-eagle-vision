import React from 'react';

interface LabelProps {
    children: React.ReactNode;
    [key: string]: any; // to allow for other props
}

export const Label: React.FC<LabelProps> = ({ children, ...props }) => (
    <label {...props} className="block text-gray-700 font-bold mb-2">
        {children}
    </label>
);