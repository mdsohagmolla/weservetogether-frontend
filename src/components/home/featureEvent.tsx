import Image from "next/image"
import Link from "next/link"
import type { ComponentType } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LeafCluster } from "@/components/leaf-cluster"
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Leaf,
  MapPin,
  Stethoscope,
  Droplet,
  GraduationCap,
  Utensils,
  Users,
  UserRound,
} from "lucide-react"
import { cn } from "cn"

const FEATURE_EVENT_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/feature-event`

type FeaturedEvent = {
  id: string
  title: string
  type: string
  date: string
  location: string
  thumbnail: string
  description: string
  organizer: string
}

type CategoryStyle = {
  label: string
  icon: ComponentType<{ className?: string }>
  iconClassName: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "clothing-distribution": { label: "Donation", icon: Heart, iconClassName: "text-red-500 fill-red-500" },
  "tree-planting": { label: "Tree Plantation", icon: Leaf, iconClassName: "text-green-600" },
  "food-distribution": { label: "Food Drive", icon: Heart, iconClassName: "text-sky-500" },
  "healthcare-awareness": { label: "Healthcare", icon: Stethoscope, iconClassName: "text-teal-600" },
  "blood-donation": { label: "Blood Donation", icon: Droplet, iconClassName: "text-red-500" },
  "education-training": { label: "Education", icon: GraduationCap, iconClassName: "text-indigo-500" },
  "food-support": { label: "Food Drive", icon: Utensils, iconClassName: "text-orange-500" },
  "community-gathering": { label: "Gathering", icon: Users, iconClassName: "text-green-600" },
}

const FALLBACK_CATEGORY: CategoryStyle = {
  label: "Community",
  icon: CalendarDays,
  iconClassName: "text-green-600",
}

function getCategoryStyle(type: string): CategoryStyle {
  return CATEGORY_STYLES[type] ?? FALLBACK_CATEGORY
}

function formatDate(isoDate: string): string {
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

/** Sample events matching the design, used when the feature API is unreachable. */
const FALLBACK_EVENTS: FeaturedEvent[] = [
  {
    id: "winter-clothes-distribution",
    title: "Winter Clothes Distribution",
    type: "clothing-distribution",
    date: "2025-11-15",
    location: "Mirpur 10, Dhaka",
    thumbnail: "/images/winter clothes distribution.png",
    description:
      "Collecting and distributing warm clothes, jackets, and blankets to underprivileged families in our community.",
    organizer: "Mirpur Youth Volunteers",
  },
  {
    id: "tree-plantation-drive",
    title: "Tree Plantation Drive",
    type: "tree-planting",
    date: "2025-11-16",
    location: "Dhanmondi, Dhaka",
    thumbnail: "/images/Together We Serve_ Planting Hope.png",
    description:
      "Let's make our city greener! Join the tree plantation drive and help fight climate change.",
    organizer: "Green Earth Club",
  },
  {
    id: "food-support-for-the-needy",
    title: "Food Support for the Needy",
    type: "food-distribution",
    date: "2025-11-18",
    location: "Mohammadpur, Dhaka",
    thumbnail: "/images/Together We Serve Volunteer Team.png",
    description:
      "Help us provide essential food items to families in need this winter.",
    organizer: "Together We Serve Team",
  },
]

type ApiEvent = {
  _id?: string
  id?: string
  title?: string
  type?: string
  date?: string
  location?: string
  thumbnail?: string
  description?: string
  organizer?: string
}

function normalizeThumbnail(thumbnail: unknown): string {
  if (typeof thumbnail !== "string") return ""
  const value = thumbnail.trim()
  if (value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://")) {
    return value
  }
  return ""
}

function normalizeEvent(raw: ApiEvent, index: number): FeaturedEvent | null {
  const title = typeof raw?.title === "string" ? raw.title.trim() : ""
  if (!title) return null

  const location = typeof raw.location === "string" ? raw.location.trim() : ""
  const organizer = typeof raw.organizer === "string" ? raw.organizer.trim() : ""

  return {
    id: String(raw._id ?? raw.id ?? `event-${index}`),
    title,
    type: typeof raw.type === "string" ? raw.type : "",
    date: typeof raw.date === "string" ? raw.date : "",
    location: location || "Location to be announced",
    thumbnail: normalizeThumbnail(raw.thumbnail),
    description: typeof raw.description === "string" ? raw.description.trim() : "",
    organizer: organizer || "TogetherWeServe",
  }
}

async function fetchFeaturedEvents(): Promise<FeaturedEvent[]> {
  try {
    const res = await fetch(FEATURE_EVENT_API_URL, {
      next:{
        revalidate: 60,
      } })
    if (!res.ok) {
      throw new Error(`Feature API responded with status ${res.status}`)
    }

    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      throw new Error("Feature API returned a non-array response")
    }

    const events = data
      .map((item, index) => normalizeEvent(item as ApiEvent, index))
      .filter((event): event is FeaturedEvent => event !== null)

    return events.length > 0 ? events : FALLBACK_EVENTS
  } catch (error) {
    console.warn(
      "Could not load featured events from the API — showing sample events instead.",
      error
    )
    return FALLBACK_EVENTS
  }
}

function EventCard({ event }: { event: FeaturedEvent }) {
  const category = getCategoryStyle(event.type)
  const CategoryIcon = category.icon

  return (
    <Card className="h-full gap-0 overflow-hidden rounded-xl bg-white p-0 shadow-[0_2px_12px_rgba(16,60,32,0.07)] ring-1 ring-black/5 transition-shadow hover:shadow-[0_8px_24px_rgba(16,60,32,0.12)]">
      <div className="relative">
        {event.thumbnail ? (
          <Image
            src={event.thumbnail}
            alt={event.title}
            width={800}
            height={450}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-44 w-full object-cover sm:h-48"
          />
        ) : (
          <div className="grid h-44 w-full place-items-center bg-brand-soft sm:h-48">
            <Leaf className="size-10 text-[#9fdcb6]" />
          </div>
        )}

        <Badge className="absolute top-3 left-3 h-auto gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
          <CategoryIcon className={cn("size-3.5", category.iconClassName)} />
          {category.label}
        </Badge>

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/65 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <CalendarDays className="size-3.5 text-[#5ddc8c]" />
          {formatDate(event.date)}
        </span>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-heading text-lg leading-snug font-bold text-gray-900">
          {event.title}
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="size-4 shrink-0 text-[#1f9d58]" />
          {event.location}
        </p>

        <p className="text-sm leading-relaxed text-gray-600">{event.description}</p>

        <div className="mt-auto flex items-center gap-1.5 border-t border-gray-100 pt-3 text-sm text-gray-500">
          <UserRound className="size-4 shrink-0 text-[#1f9d58]" />
          {event.organizer}
        </div>

        <Button
          nativeButton={false}
          render={<Link href={`/upcoming-event/${event.id}`} />}
          className="h-11 w-full gap-2 rounded-lg bg-[#1d7e46] text-sm font-semibold hover:bg-[#166534]"
        >
          View Event
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

const FeatureEventPage = async () => {
  const events = await fetchFeaturedEvents()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f3faf6] to-[#eaf6ee]">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-8 lg:pt-16 lg:pb-28">
        {/* Section header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <Heart className="size-5 fill-[#2e9e5b] text-[#2e9e5b]" />
              <span className="text-sm font-bold tracking-[0.14em] text-[#166534] uppercase">
                Upcoming Initiatives
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-gradient-to-r from-[#bfe3cd] to-transparent"
              />
            </div>

            <h2 className="font-heading mt-4 text-3xl leading-[1.15] font-extrabold tracking-tight text-brand-deep sm:text-4xl">
              Recent Upcoming Events
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Latest community drives scheduled in your city. Get involved today.
            </p>
          </div>

          <Link
            href="/upcoming-event"
            className="group inline-flex shrink-0 items-center gap-2.5 self-start sm:mt-1"
          >
            <span className="font-heading text-sm font-semibold text-[#166534] underline underline-offset-4 group-hover:text-[#0f4a26]">
              View All Events
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-[#dff2e4] text-[#166534] transition-colors group-hover:bg-[#cbe9d6]">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>

        {/* Events grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <EventCard key={event.id || `event-${index}`} event={event} />
          ))}
        </div>
      </div>

      {/* soft wave along the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="h-20 w-full text-white sm:h-28"
        >
          <path
            fill="currentColor"
            d="M0 76C230 124 460 36 720 52c262 16 460 84 720 44v44H0V76Z"
          />
        </svg>
        <svg
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="-mt-14 h-20 w-full text-[#dff2e8] sm:-mt-18 sm:h-28"
        >
          <path
            fill="currentColor"
            d="M0 100c250 32 470-40 748-26 258 13 432 70 692 36v30H0v-40Z"
          />
        </svg>
      </div>

      {/* decorative leaf cluster */}
      <LeafCluster className="right-2 bottom-14 z-10 hidden text-[#8ed9ab] opacity-70 sm:block" />
    </section>
  )
}

export default FeatureEventPage
