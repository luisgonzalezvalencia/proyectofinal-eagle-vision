import React from 'react';

export const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white shadow-md rounded-lg p-6">
        {children}
    </div>
);

export const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
export const CardTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>;
export const CardDescription = ({ children }: { children: React.ReactNode }) => <p className="text-gray-600">{children}</p>;
export const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;