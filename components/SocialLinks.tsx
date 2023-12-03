
import Image from "next/image"

export default function SocialLinks() {
  const iconSize = 20
  return (
    <div className="flex flex-row space-x-3 opacity-80 pt-1 mt-1">
      {/* Twitter Icon */}
      <a href="https://twitter.com/itstimconnors">
        <Image src="/twitter.svg" alt="Twitter Logo" width={iconSize} height={iconSize} className="hover:opacity-50" />
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