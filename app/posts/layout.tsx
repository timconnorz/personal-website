"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="mt-8">
      <button onClick={() => router.back()}>
        <Image
          src="/left-caret.svg"
          alt="left caret"
          width={28}
          height={28}
          className="fixed -translate-x-20 translate-y-2 opacity-75"
        />
      </button>
      {children}
    </div>
  );
}
