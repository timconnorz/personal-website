import Image from "next/image";
import SocialLinks from "@/components/SocialLinks"

export default function ProfileHeader({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const avatarSize = 110;
  return (
    <div className="flex md:space-x-2 space-x-4 mt-10">
      <div className="w-1/3 md:w-1/4">
        <Image
          priority
          src="/apple-avatar.png"
          alt="avatar"
          width={avatarSize}
          height={avatarSize}
          className="rounded-full"
        />
      </div>
      <div className="w-2/3 md:w-3/4 flex flex-col space-y-1 justify-center">
        <h1 className="m-0">{name}</h1>
        <p className="text-md">{description}</p>
        <SocialLinks/>
      </div>
    </div>
  );
}