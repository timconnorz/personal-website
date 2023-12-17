"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname()

  const goBack = () => {
    const path = pathname.split('/');
    path.pop();
    let newPath = path.join('/');
    if (newPath === "/posts") newPath = "/";
    router.push(newPath);
  }

  return (
    <div className="mt-8">
      <button onClick={goBack}>
        <Image
          src="/left-caret.svg"
          alt="left caret"
          width={28}
          height={28}
          className="sm:fixed absolute sm:-translate-x-16 md:-translate-x-20 sm:translate-y-2 -translate-y-5 -translate-x-2 opacity-75"
        />
      </button>
      <div className="sm:mt-0 mt-6">
      {children}
      </div>
    </div>
  );
}
