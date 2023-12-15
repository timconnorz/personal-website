"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname()

  console.log(pathname)

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
          className="fixed -translate-x-20 translate-y-2 opacity-75"
        />
      </button>
      {children}
    </div>
  );
}
