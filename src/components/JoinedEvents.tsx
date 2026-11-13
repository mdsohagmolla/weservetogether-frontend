'use client'

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf } from "@/components/leaf-cluster"
import { getCategoryStyle } from "@/components/UpcomingEvents"
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  Heart,
  MapPin,
  UserRound,
} from "lucide-react"
import { cn } from "cn"
import { redirect } from "next/navigation"

export type JoinedEvent = {
  id: string
  title: string
  type: string
  date: string
  location: string
  thumbnail: string
  description: string
  joinedAt: string
}

/** Tinted pill background per category, matching the reference design. */
const CATEGORY_CHIP: Record<string, string> = {
  "cleanliness-drive": "bg-[#e6f6ec] text-[#186034]",
  "tree-planting": "bg-[#e6f6ec] text-[#186034]",
  "clothing-distribution": "bg-[#fdeceb] text-[#b42318]",
  "food-distribution": "bg-[#fff2e0] text-[#b45309]",
  "education-training": "bg-[#fff2e0] text-[#b45309]",
  "healthcare-awareness": "bg-[#e4f5f5] text-[#0f766e]",
  "blood-donation": "bg-[#fdeceb] text-[#b42318]",
  "disaster-relief": "bg-[#fff2e0] text-[#b45309]",
  "animal-welfare": "bg-[#fef5e7] text-[#b45309]",
  "community-gathering": "bg-[#e6f6ec] text-[#186034]",
}

const DEFAULT_CHIP = "bg-white/95 text-gray-800"

function formatDateOnly(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return "Date to be announced"
  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  )
}

function formatJoined(value: string): string {
  if (!value) return "Recently"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return formatDateOnly(value)
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

/**
 * Decorative header artwork: three volunteers holding hands under a heart,
 * sitting on a soft green cloud with scattered leaves.
 */
function CommitmentsArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 -36 360 280"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Soft cloud backdrop */}
      <path
        d="M64 244c-33 0-60-24-60-55 0-29 23-53 53-57C64 62 106 2 164 2c30 0 58 12 78 33 19-16 43-26 70-26 50 0 88 34 92 80 26 7 43 30 43 56 0 58-42 99-92 99z"
        fill="#e7f6ec"
      />

      {/* Heart floating above the group */}
      <path
        d="M180 64s-31-17-31-34c0-11 8-18 18-18 7 0 12 4 13 9 1-5 5-9 13-9 10 0 18 7 18 18 0 17-31 34-31 34z"
        fill="#2f9e63"
      />

      {/* Left volunteer */}
      <circle cx="110" cy="110" r="13" fill="#6fc497" />
      <rect x="89" y="144" width="42" height="64" rx="20" fill="#6fc497" />
      <path
        d="M92 158 74 186M128 152 136 112"
        stroke="#6fc497"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Center volunteer */}
      <circle cx="180" cy="92" r="15" fill="#2f9e63" />
      <rect x="156" y="128" width="48" height="80" rx="22" fill="#2f9e63" />
      <path
        d="M162 140 136 112M198 140 224 112"
        stroke="#2f9e63"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Right volunteer */}
      <circle cx="250" cy="110" r="13" fill="#57b98a" />
      <rect x="229" y="144" width="42" height="64" rx="20" fill="#57b98a" />
      <path
        d="M268 158 286 186M232 152 224 112"
        stroke="#57b98a"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Joined hands */}
      <circle cx="136" cy="112" r="6.5" fill="#1f7f4d" />
      <circle cx="224" cy="112" r="6.5" fill="#1f7f4d" />

      {/* Leaves */}
      <path
        d="M21 3C10 3 3 10 3 21c11 0 18-7 18-18Z"
        transform="translate(28 148) rotate(-28) scale(1.7)"
        fill="#8ed9ab"
        opacity="0.75"
      />
      <path
        d="M21 3C10 3 3 10 3 21c11 0 18-7 18-18Z"
        transform="translate(56 196) rotate(38) scale(1.4)"
        fill="#6fc497"
        opacity="0.7"
      />
      <path
        d="M21 3C10 3 3 10 3 21c11 0 18-7 18-18Z"
        transform="translate(316 96) rotate(24) scale(1.8)"
        fill="#8ed9ab"
        opacity="0.75"
      />
      <path
        d="M21 3C10 3 3 10 3 21c11 0 18-7 18-18Z"
        transform="translate(300 168) rotate(-46) scale(1.5)"
        fill="#6fc497"
        opacity="0.65"
      />
    </svg>
  )
}

function JoinedEventCard({ event }: { event: JoinedEvent }) {
  const category = getCategoryStyle(event.type)
  const CategoryIcon = category.icon
  const chip = CATEGORY_CHIP[event.type] ?? DEFAULT_CHIP
  

  // handle function: 
  const handelCancelBooking = async()=>{
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mybookings/${event.id}`,{
    method: 'DELETE',


  })
  const data = await res.json();
  console.log(data)
  redirect('/join-event')
    

  }

  return (
    <Card className="h-full gap-0 overflow-hidden rounded-xl bg-white p-0 shadow-[0_2px_12px_rgba(16,60,32,0.06)] ring-1 ring-black/5 transition-shadow hover:shadow-[0_8px_24px_rgba(16,60,32,0.12)]">
      <div className="relative">
        {event.thumbnail ? (
          <Image
            src={event.thumbnail}
            alt={event.title}
            width={800}
            height={450}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-44 w-full object-cover sm:h-48"
          />
        ) : (
          <div className="grid h-44 w-full place-items-center bg-[#e6f4ea] sm:h-48">
            <Leaf className="size-10 text-[#9fdcb6]" />
          </div>
        )}

        <Badge
          className={cn(
            "absolute top-3 left-3 h-auto gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm",
            chip
          )}
        >
          <CategoryIcon className={cn("size-3.5", category.iconClassName)} />
          {category.label}
        </Badge>

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/65 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <CalendarDays className="size-3.5" />
          {formatDateOnly(event.date)}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="font-heading text-lg leading-snug font-bold text-gray-900">
          {event.title}
        </h2>

        <p className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="size-4 shrink-0 text-[#1f9d58]" />
          {event.location}
        </p>

        <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
          {event.description}
        </p>

        <div className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-3 text-sm font-semibold text-[#1f9d58]">
          <UserRound className="size-4 shrink-0" />
          Joined {formatJoined(event.joinedAt)}
        </div>

        <div className="flex w-full items-center gap-2">
  <Button
    nativeButton={false}
    render={<Link href={`/upcoming-event/${event.id}`} />}
    className="h-11 flex-1 gap-2 rounded-lg text-sm font-semibold sm:text-base"
  >
    View Event
    <ArrowRight className="size-4" />
  </Button>

  <Button
  onClick={handelCancelBooking}
    type="button"
    
    className="h-11 flex-1 rounded-lg border-red-500 bg-white text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 sm:text-base"
    variant="outline"
  >
    Cancel Event
  </Button>
</div>
        
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(16,60,32,0.06)] ring-1 ring-black/5">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e6f4ea]">
        <CircleCheck className="size-6 text-[#1f9d58]" />
      </span>
      <h2 className="font-heading mt-4 text-lg font-semibold text-gray-900">
        No commitments yet
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
        Events you join will show up here so you never miss a drive you signed up
        for.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/upcoming-event" />}
        className="mt-6 h-11 gap-2 rounded-xl px-6 text-sm font-semibold sm:text-base"
      >
        Browse Events
        <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}

function SignedOutState() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(16,60,32,0.06)] ring-1 ring-black/5">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e6f4ea]">
        <UserRound className="size-6 text-[#1f9d58]" />
      </span>
      <h2 className="font-heading mt-4 text-lg font-semibold text-gray-900">
        Sign in to see your commitments
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
        Log in with your account to keep track of every volunteer drive you have
        joined.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/log-in" />}
        className="mt-6 h-11 gap-2 rounded-xl px-6 text-sm font-semibold sm:text-base"
      >
        Log In
      </Button>
    </div>
  )
}

export default function JoinedEvents({
  events,
  isSignedIn = true,
}: {
  events: JoinedEvent[]
  isSignedIn?: boolean
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-[#e2efe7] bg-white">
        <CommitmentsArt className="pointer-events-none absolute top-0 right-0 hidden h-[300px] w-auto lg:block" />

        <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
          <Badge className="h-auto gap-2 rounded-full bg-[#dff2e4] px-4 py-2 text-sm font-medium text-[#186034]">
            <CircleCheck />
            My Volunteer Commitments
          </Badge>

          <h1 className="font-heading mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-brand-deep sm:text-5xl lg:text-6xl">
            Joined Events
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
            Here are all the social development and community service drives you
            have signed up for, sorted by event date.
          </p>
        </div>
      </header>

      {/* Joined events grid */}
      <main className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        {!isSignedIn ? (
          <SignedOutState />
        ) : events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <JoinedEventCard
                key={event.id || `joined-${index}`}
                event={event}
              />
            ))}
          </div>
        )}

        {/* Footer rule */}
        <div className="mt-14 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-[#bfe3ce] sm:w-40" />
          <span className="font-heading flex items-center gap-2 text-sm font-semibold text-[#1f9d58]">
            Together We Serve
            <Heart className="size-4 fill-[#1f9d58] text-[#1f9d58]" />
          </span>
          <span className="h-px w-16 bg-[#bfe3ce] sm:w-40" />
        </div>
      </main>
    </div>
  )
}
