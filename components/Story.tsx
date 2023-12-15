import Link from "next/link";

export default function Story({
  year,
  title,
  description,
  link,
  children,
}: {
  year: string;
  title: string;
  description: string;
  link: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex mb-9">
      <p className="w-1/3 md:w-1/4 opacity-40 m-0">{year}</p>
      <div className="w-2/3 md:w-3/4 space-y-2">
        <Link href={link || "/"} className="no-underline hover:no-underline">
          <p className=" opacity-80 mb-2 hover:underline">{title}</p>
          <p className="mb-0 hover:no-underline">{description}</p>
        </Link>
      </div>
    </div>
  );
}
