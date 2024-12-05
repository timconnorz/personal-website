
import Image from "next/image"

export default function SocialLinks() {
  const iconSize = 20
  return (
    <div className="flex flex-row space-x-3 opacity-80 pt-1 mt-1">
      {/* Bluesky Icon */}
      <a href="https://bsky.app/profile/timconnors.bsky.social">
        <Image src="/bluesky.svg" alt="Bluesky Logo" width={iconSize} height={iconSize} className="hover:opacity-50" />
      </a>
      {/* LinkedIn Icon */}
      <a href="https://www.linkedin.com/in/itstimconnors">
        <Image src="/linkedin.svg" alt="LinkedIn Logo" width={iconSize} height={iconSize} className="hover:opacity-50"/>
      </a>
      {/* Github Icon */}
      <a href="https://github.com/timconnorz">
        <Image src="/github.svg" alt="Github Logo" width={iconSize} height={iconSize} className="hover:opacity-50"/>
      </a>
    </div>
  )
}