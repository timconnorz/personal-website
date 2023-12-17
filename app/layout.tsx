import React, { ReactNode, Suspense } from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { PHProvider, PostHogPageview } from "./providers";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  metadataBase:
    process.env.NODE_ENV === "production"
      ? new URL("https://timconnors.co")
      : new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>
        <body className="container max-w-xl mb-10">{children}</body>
      </PHProvider>
    </html>
  );
}
