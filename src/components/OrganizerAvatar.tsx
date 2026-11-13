"use client"

import { useState } from "react"
import Image from "next/image"
import { UserRound } from "lucide-react"

type OrganizerAvatarProps = {
  /** Portrait URL. Falls back to initials when missing or when the image fails to load. */
  src?: string
  name: string
}

export default function OrganizerAvatar({ src, name }: OrganizerAvatarProps) {
  const [failed, setFailed] = useState(false)

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  const showImage = Boolean(src) && !failed

  return (
    <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-[#cdeed9] shadow-md ring-4 ring-white">
      {showImage ? (
        <Image
          src={src as string}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : initials ? (
        <span className="font-heading text-lg font-bold text-brand-dark">
          {initials}
        </span>
      ) : (
        <UserRound className="size-7 text-brand" />
      )}
    </span>
  )
}
