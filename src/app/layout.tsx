import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowGrid",
  description: "FlowGrid application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <script src="https://tweakcn.com/live-preview.min.js"></script>
      </head>
      <body
        className={`${outfit.variable} antialiased dark`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}