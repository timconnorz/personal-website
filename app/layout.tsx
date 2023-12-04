import React, { ReactNode, Suspense } from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { PHProvider, PostHogPageview } from "./providers";
// import PostHogClient from "./clients/posthog";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Tim Connors",
  description: "Here's a bit about me...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
