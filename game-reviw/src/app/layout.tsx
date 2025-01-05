import type { Metadata } from "next";
import { AuthProvider } from "../app/context/AuthContext";
import Header from "../app/components/header"
import { Toaster } from 'react-hot-toast';
import Footer from "../app/components/footer"
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GameLens",
  description: "Video Game Reviewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
