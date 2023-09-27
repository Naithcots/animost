"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  src: string | null;
  username: string;
};

const UserAvatar = ({ src, username }: UserAvatarProps) => {
  const fallbackName = username.substring(0, 2).toUpperCase();

  return (
    <Avatar>
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallbackName}</AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
