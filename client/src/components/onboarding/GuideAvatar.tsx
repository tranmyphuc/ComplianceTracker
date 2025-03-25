
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function GuideAvatar() {
  return (
    <div className="w-24 h-24 bg-yellow-300 rounded-full flex items-center justify-center relative">
      <Avatar className="w-full h-full">
        <AvatarImage src="/jack-avatar.jpg" alt="Jack" />
        <AvatarFallback className="bg-yellow-300 text-black text-xl">
          Jack
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
