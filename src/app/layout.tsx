import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/features/nav/navbar"
import { AuthProvider } from "@/lib/auth-context";
import Link from "next/link";
import { QueryProvider } from "@/lib/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Schedule",
  description: "TCID Online Schedule",
};

export default function RootLayout({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`relative ${geistSans.variable} ${geistMono.variable} antialiased typography min-h-screen flex flex-col`}>
          <AuthProvider>
            <QueryProvider>
              <main className="flex-grow pb-20 sm:pb-14">
                <Navbar />
                {children}
                {auth}
              </main>
            </QueryProvider>  
          </AuthProvider>
        <footer className="absolute bottom-0 w-full bg-gray-800 text-white text-center py-4">
          <p className="text-sm hover:underline">
            <Link legacyBehavior href="https://github.com/mikelambson/TCID-Sched/blob/main/LICENSE" passHref >
              <a target="_blank" rel="noopener noreferrer">
                &copy; {new Date().getFullYear()} TCID Online Schedule. Developed by V. Michael Lambson. Licensed under the BSD-3-Clause License. All rights reserved.
              </a>
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
