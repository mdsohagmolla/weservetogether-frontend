import Image from "next/image"
import Link from "next/link"
import type { ComponentType } from "react"
import { LeafCluster, Leaf } from "@/components/leaf-cluster"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  CalendarDays,
  CirclePlus,
  Droplet,
  GraduationCap,
  Heart,
  LifeBuoy,
  MapPin,
  PawPrint,
  Stethoscope,
  Trash,
  Users,
  Utensils,
  UserRound,
} from "lucide-react"
import { cn } from "cn"

export type UpcomingEvent = {
  id: string
  title: string
  type: string
  date: string
  location: string
  thumbnail: string
  description: string
  organizer: string
  organizerEmail: string |undefined
}

export type CategoryStyle = {
  label: string
  icon: ComponentType<{ className?: string }>
  iconClassName: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "clothing-distribution": { label: "Donation", icon: Heart, iconClassName: "text-red-500 fill-red-500" },
  "tree-planting": { label: "Plantation", icon: Leaf, iconClassName: "text-green-600" },
  "cleanliness-drive": { label: "Cleanup", icon: Trash, iconClassName: "text-green-600" },
  "food-distribution": { label: "Food", icon: Utensils, iconClassName: "text-orange-500" },
  "healthcare-awareness": { label: "Healthcare", icon: Stethoscope, iconClassName: "text-teal-600" },
  "blood-donation": { label: "Blood Donation", icon: Droplet, iconClassName: "text-red-500" },
  "education-training": { label: "Education", icon: GraduationCap, iconClassName: "text-indigo-500" },
  "disaster-relief": { label: "Relief", icon: LifeBuoy, iconClassName: "text-orange-600" },
  "animal-welfare": { label: "Animal Welfare", icon: PawPrint, iconClassName: "text-amber-600" },
  "community-gathering": { label: "Gathering", icon: Users, iconClassName: "text-green-600" },
}

const FALLBACK_CATEGORY: CategoryStyle = {
  label: "Community",
  icon: CalendarDays,
  iconClassName: "text-green-600",
}

export function getCategoryStyle(type: string) {
  return CATEGORY_STYLES[type] ?? FALLBACK_CATEGORY
}

export function formatDate(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate)
  if (!match) return "Date to be announced"
  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function CheerSquad({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 140" className={className} fill="currentColor" aria-hidden="true">
      {/* left person */}
      <circle cx="42" cy="54" r="13" />
      <path d="M22 140V104c0-20 9-38 20-38s20 18 20 38v36z" />
      <path d="M28 84 12 56" stroke="currentColor" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M56 84 72 56" stroke="currentColor" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* center person */}
      <circle cx="120" cy="40" r="15" />
      <path d="M98 140V96c0-22 10-42 22-42s22 20 22 42v44z" />
      <path d="M106 74 88 42" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M134 74 152 42" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* right person */}
      <circle cx="198" cy="56" r="13" />
      <path d="M178 140v-36c0-20 9-38 20-38s20 18 20 38v36z" />
      <path d="M184 86 168 58" stroke="currentColor" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M212 86 228 58" stroke="currentColor" strokeWidth="9" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function HeaderDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute top-8 right-[26%] hidden size-12 -rotate-12 text-[#8ed9ab] lg:block"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <CheerSquad className="absolute right-[2%] bottom-0 hidden h-36 w-auto text-[#9fdcbb] opacity-70 sm:block lg:h-44" />
      <LeafCluster className="top-1 right-1 hidden text-[#7ed39a] opacity-60 lg:block" />
    </div>
  )
}

function EventCard({ event }: { event: UpcomingEvent }) {
  const category = getCategoryStyle(event.type)
  const CategoryIcon = category.icon
  console.log('organizer evetn ',event)

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

        <Badge className="absolute top-3 left-3 h-auto gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
          <CategoryIcon className={cn("size-3.5", category.iconClassName)} />
          {category.label}
        </Badge>

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/65 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <CalendarDays className="size-3.5" />
          {formatDate(event.date)}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="font-heading text-base leading-snug font-semibold text-gray-900">
          {event.title}
        </h2>

        <p className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="size-4 shrink-0 text-[#1f9d58]" />
          {event.location}
        </p>

        <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
          {event.description}
        </p>

        <div className="mt-auto flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500 sm:text-sm">
          <UserRound className="size-4 shrink-0 text-[#1f9d58]" />
          Organizer email: {event.organizerEmail}
        </div>

        <Button
          nativeButton={false}
          render={<Link href={`/upcoming-event/${event.id}?from=upcoming`} />}
          className="h-10 w-full gap-2 rounded-lg font-semibold"
        >
          View Event
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(16,60,32,0.06)] ring-1 ring-black/5">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e6f4ea]">
        <CalendarDays className="size-6 text-[#1f9d58]" />
      </span>
      <h2 className="font-heading mt-4 text-lg font-semibold text-gray-900">
        No upcoming events yet
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
        New community drives will appear here as soon as they are scheduled. Want to
        start one?
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/add-event" />}
        className="mt-6 h-11 gap-2 rounded-xl px-6 text-sm font-semibold sm:text-base"
      >
        <CirclePlus />
        Create Event
      </Button>
    </div>
  )
}

export default function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3faf6]">
      {/* Decorative background leaves */}
      <LeafCluster className="-bottom-10 -left-16 scale-160 text-[#9fdfbd] opacity-50" />
      <LeafCluster className="right-[-4.5rem] bottom-48 scale-150 -rotate-12 text-[#9fdfbd] opacity-40" />

      <div className="relative">
        {/* Section header */}
        <header className="relative overflow-hidden bg-[linear-gradient(125deg,#e7f6ec_0%,#f1faf3_55%,#f8fdf9_100%)]">
          <HeaderDecorations />

          <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-14 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <Badge className="h-auto rounded-full bg-[#dff2e4] px-3.5 py-1.5 text-sm font-medium text-[#186034]">
                  <CalendarDays />
                  Future Community Drives
                </Badge>

                <h1 className="font-heading mt-5 text-4xl leading-[1.1] font-extrabold tracking-tight text-brand-deep sm:text-5xl">
                  Upcoming <span className="text-[#2e9e5b]">Events</span>
                </h1>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
                  Discover verified volunteer initiatives scheduled for upcoming dates.
                  Past events are automatically excluded so you can focus on active
                  drives that need support.
                </p>

                <svg
                  className="mt-4 h-5 w-44 text-[#2e9e5b]"
                  viewBox="0 0 176 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 15C35 6 90 3 172 8"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <Button
                nativeButton={false}
                render={<Link href="/add-event" />}
                className="h-12 w-full shrink-0 gap-2 rounded-xl px-6 text-base font-semibold shadow-sm sm:w-auto"
              >
                <CirclePlus />
                Create Event
              </Button>
            </div>
          </div>
        </header>

        {/* Events grid */}
        <main className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <EventCard key={event.id || `event-${index}`} event={event} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
