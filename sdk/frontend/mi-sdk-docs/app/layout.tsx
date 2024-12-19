import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eagle Vision SDK",
  description: "SDK para el registro de asistencia y control de acceso mediante reconocimiento facial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
