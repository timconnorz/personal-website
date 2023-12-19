/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { StoryTag } from "@/lib/types";

export interface StoryProps {
  slug: string;
  date: string;
  title: string;
  description: string;
  link: string;
  tag: StoryTag;
}

// function that converts YYYY-MM-DD to MMM DD
// if year is not current year, include year
export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  const dateObj = new Date(date);
  const currentYear = new Date().getFullYear();
  const formattedMonth = dateObj.toLocaleString("default", { month: "short" });
  const formattedDay = dateObj.toLocaleString("default", { day: "numeric" });
  const formattedYear = currentYear === Number(year) ? "" : year;
  return `${formattedMonth} ${formattedDay}${
    formattedYear ? " " + formattedYear : ""
  }`;
};

const placeholderImage = "/avatar.png";

// TypeScript React
export default function Story({
  slug,
  date,
  title,
  description,
  link,
  tag,
}: StoryProps) {
  return (
    <div className="flex items-center mb-9 gap-3">
      <div className="md:w-1/6 w-1/4">
      <Link href={link || "/"} className="no-underline hover:no-underline">
        <img src={ slug ? `/${slug}/thumbnail.png` : placeholderImage} alt="story" className="rounded-md" />
      </Link>
      </div>
      <div className="md:w-5/6 w-3/4 space-y-2">
        <Link href={link || "/"} className="no-underline hover:no-underline">
          <p className="text-sm opacity-80 mb-2 hover:underline line-clamp-1">{title}</p>
          <p className="text-xs mb-0 hover:no-underline line-clamp-2">
            {description}
          </p>{" "}
          <p className="text-xs mt-2 mb-0 opacity-50 flex items-center">
            {formatDate(date)}
            <span className="mx-2 bg-black rounded-full h-1 w-1 inline-block"></span>
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </p>
        </Link>
      </div>
    </div>
  );
}
