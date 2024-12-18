import Header from '@/components/Header';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LuGon Corp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white">
          {/* Header con logo y slogan */}
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}

