import type { Metadata } from "next";
import Header from "./components/header"
import { Toaster } from 'react-hot-toast';
import Footer from "./components/footer"
import "./globals.css";


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
