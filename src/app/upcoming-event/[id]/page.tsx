

import type { Metadata } from "next"
import Image from "next/image"

import Link from "next/link"
import { notFound } from "next/navigation"
import { LeafCluster, Leaf } from "@/components/leaf-cluster"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import EventJoinBar from "@/components/EventJoinBar"
import OrganizerAvatar from "@/components/OrganizerAvatar"
import { formatDate, getCategoryStyle } from "@/components/UpcomingEvents"
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  CircleCheck,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react"
import EditEventDialog from "@/components/editEventDialog";
import DeleteEventDialogPage from "@/components/deleteEventDialog";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenFromServer } from "@/lib/getTokenFromServer";


const EVENTS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/upcoming-event`

/** Shown when the organizer has no portrait of their own. */
const DEFAULT_AVATAR = "https://randomuser.me/api/portraits/men/32.jpg"

export type EventDetail = {
  id: string

  title: string
  type: string
  date: string
  location: string
  thumbnail: string
  description: string
  organizer: string
  organizerRole: string
  organizerEmail: string
  organizerAvatar: string
  volunteers: number
  guidelines: string[]
}

export type ApiEventDetail = {
  _id?: string
  id?: string
  title?: string
  type?: string
  date?: string
  location?: string
  thumbnail?: string
  description?: string
  organizer?: string
  organizerName?: string
  organizerRole?: string
  organizerEmail?: string
  organizerAvatar?: string
  volunteers?: number
  volunteersJoined?: number
  joinedVolunteers?: number
  guidelines?: string[]
}

/** Sample details matching the design, used when the event API is unreachable. */
const FALLBACK_DETAILS: EventDetail[] = [
  {
    id: "winter-clothes-distribution-mirpur-10",
    title: "Winter Clothes Distribution – Mirpur 10",
    type: "clothing-distribution",
    date: "2026-12-06",
    location: "Mirpur 10, Dhaka",
    thumbnail: "/images/winter clothes distribution.png",
    description:
      "Help us distribute warm clothes to underprivileged families in Mirpur. Together we can make a difference!",
    organizer: "Rafiqul Islam",
    organizerRole: "Volunteer",
    organizerEmail: "rafiqul@gmail.com",
    organizerAvatar: "",
    volunteers: 15,
    guidelines: [],
  },
  {
    id: "community-tree-plantation-drive",
    title: "Community Tree Plantation Drive",
    type: "tree-planting",
    date: "2026-12-14",
    location: "Dhanmondi Lake, Dhaka",
    thumbnail: "/images/Together We Serve_ Planting Hope.png",
    description:
      "Let's plant trees together for a greener and healthier Bangladesh.",
    organizer: "Rafiqul Islam",
    organizerRole: "Volunteer",
    organizerEmail: "rafiqul@gmail.com",
    organizerAvatar: "",
    volunteers: 15,
    guidelines: [],
  },
  {
    id: "clean-our-neighborhood-campaign",
    title: "Clean Our Neighborhood Campaign",
    type: "cleanliness-drive",
    date: "2026-12-20",
    location: "Uttara Sector 7, Dhaka",
    thumbnail: "/images/Together We Serve Community Day.png",
    description:
      "Let's make our neighborhood cleaner and healthier. Volunteers will collect waste, clean public spaces, and spread awareness about proper waste management.",
    organizer: "Rafiqul Islam",
    organizerRole: "Volunteer",
    organizerEmail: "rafiqul@gmail.com",
    organizerAvatar: "",
    volunteers: 15,
    guidelines: [],
  },
]

const GUIDELINES_BY_TYPE: Record<string, string[]> = {
  "cleanliness-drive": [
    "Bring gloves and garbage bags.",
    "Wear comfortable clothing.",
    "Follow local safety guidelines.",
  ],
  "clothing-distribution": [
    "Bring clean, warm clothes in good condition.",
    "Reach the collection point on time.",
    "Follow local safety guidelines.",
  ],
  "tree-planting": [
    "Bring gloves and a water bottle.",
    "Wear comfortable clothing and closed shoes.",
    "Follow local safety guidelines.",
  ],
  "food-distribution": [
    "Maintain hygiene while handling food.",
    "Wear comfortable clothing.",
    "Follow local safety guidelines.",
  ],
  "healthcare-awareness": [
    "Bring your previous prescriptions, if any.",
    "Wear comfortable clothing.",
    "Follow local safety guidelines.",
  ],
  "blood-donation": [
    "Eat a light meal before donating blood.",
    "Bring a valid photo ID.",
    "Follow local safety guidelines.",
  ],
  "education-training": [
    "Bring a notebook and a pen.",
    "Arrive 10 minutes early.",
    "Follow local safety guidelines.",
  ],
  "disaster-relief": [
    "Follow the instructions of the relief coordinators.",
    "Wear comfortable clothing and sturdy shoes.",
    "Follow local safety guidelines.",
  ],
  "animal-welfare": [
    "Avoid wearing strong perfumes.",
    "Follow the handlers' instructions.",
    "Follow local safety guidelines.",
  ],
  "community-gathering": [
    "Bring your own water bottle.",
    "Be kind and respectful to fellow volunteers.",
    "Follow local safety guidelines.",
  ],
}

const DEFAULT_GUIDELINES = [
  "Register ahead of time so we can plan effectively.",
  "Bring your own water bottle and stay hydrated.",
  "Follow local safety guidelines.",
]

const DESCRIPTION_FALLBACK =
  "We are preparing the full details for this event. Check back soon — or join as a volunteer to get notified."

function normalizeThumbnail(thumbnail: unknown): string {
  if (typeof thumbnail !== "string") return ""
  const value = thumbnail.trim()
  if (
    value.startsWith("/") ||
    value.startsWith("https://") ||
    value.startsWith("http://")
  ) {
    return value
  }
  return ""
}

function normalizeAvatar(avatar: unknown): string {
  if (typeof avatar !== "string") return ""
  const value = avatar.trim()
  if (value.startsWith("https://") || value.startsWith("http://")) return value
  return ""
}

function pickVolunteerCount(raw: ApiEventDetail): number {
  const candidates = [raw.volunteersJoined, raw.volunteers, raw.joinedVolunteers]
  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
      return Math.floor(value)
    }
  }
  return 15
}

function pickGuidelines(raw: ApiEventDetail): string[] {
  if (!Array.isArray(raw.guidelines)) return []
  return raw.guidelines
    .filter(
      (item): item is string => typeof item === "string" && item.trim() !== ""
    )
    .map((item) => item.trim())
}

function normalizeDetail(raw: ApiEventDetail | null, id: string): EventDetail | null {
  if (!raw || typeof raw !== "object") return null

  const title = typeof raw.title === "string" ? raw.title.trim() : ""
  if (!title) return null

  const location =
    typeof raw.location === "string" && raw.location.trim()
      ? raw.location.trim()
      : "Location to be announced"

  const description =
    typeof raw.description === "string" ? raw.description.trim() : ""

  const organizerName =
    (typeof raw.organizerName === "string" && raw.organizerName.trim()) ||
    (typeof raw.organizer === "string" && raw.organizer.trim()) ||
    "Rafiqul Islam"

  const organizerRole =
    typeof raw.organizerRole === "string" && raw.organizerRole.trim()
      ? raw.organizerRole.trim()
      : "Volunteer"

  const organizerEmail =
    typeof raw.organizerEmail === "string" && raw.organizerEmail.trim()
      ? raw.organizerEmail.trim()
      : "rafiqul@gmail.com"

  return {
    id: String(raw._id ?? raw.id ?? id),
    title,
    type: typeof raw.type === "string" ? raw.type : "",
    date: typeof raw.date === "string" ? raw.date : "",
    location,
    thumbnail: normalizeThumbnail(raw.thumbnail),
    description,
    organizer: organizerName,
    organizerRole,
    organizerEmail,
    organizerAvatar: normalizeAvatar(raw.organizerAvatar),
    volunteers: pickVolunteerCount(raw),
    guidelines: pickGuidelines(raw),
  }
}

async function fetchEventDetail(id: string): Promise<EventDetail | null> {
  // get jwt token server 
  const token = await getTokenFromServer();
  try {
    const res = await fetch(`${EVENTS_API_URL}/${encodeURIComponent(id)}`, {
      headers: {
        authorization: `Bearer ${token}`

      },
      cache: "no-store",
    })

    if (res.ok) {
      const data: unknown = await res.json()
      const detail = normalizeDetail(data as ApiEventDetail, id)
      if (detail) return detail
    }
  } catch (error) {
    console.warn(
      "Could not load the event from the API — showing sample event instead.",
      error
    )
  }

  return FALLBACK_DETAILS.find((event) => event.id === id) ?? null
}

export async function generateMetadata({
  params,
}: PageProps<"/upcoming-event/[id]">): Promise<Metadata> {
  const { id } = await params
  const event = await fetchEventDetail(id)

  if (!event) {
    return { title: "Event Not Found | TogetherWeServe" }
  }

  return {
    title: `${event.title} | TogetherWeServe`,
    description:
      event.description ||
      "Join this community event and volunteer with TogetherWeServe.",
  }
}

export default async function EventDetailsPage({
  params, searchParams,
}: PageProps<"/upcoming-event/[id]">) {
  // get session:
  const session = await auth.api.getSession({
    headers: await headers()

  })
  const user = session?.user
  // use manage
  const { id } = await params;
  const { from } = await searchParams;

  const canManage = from === "manage";

  // 
  const event = await fetchEventDetail(id)

  if (!event) notFound()

  const category = getCategoryStyle(event.type)
  const CategoryIcon = category.icon
  const guidelines =
    event.guidelines.length > 0
      ? event.guidelines
      : (GUIDELINES_BY_TYPE[event.type] ?? DEFAULT_GUIDELINES)
  const description = event.description || DESCRIPTION_FALLBACK

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3faf6]">
      {/* Decorative background leaves */}
      <LeafCluster className="-top-4 -left-14 scale-150 text-[#a7e2c0] opacity-50" />
      <LeafCluster className="bottom-40 -left-16 scale-125 text-[#9fdfbd] opacity-40" />

      <div className="relative mx-auto max-w-6xl px-4 pt-6 pb-24 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/upcoming-event"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" />
            Back to Upcoming Events
          </Link>

          {/* Edit & Delete Buttons */}
          {canManage && (
            <div className="flex items-center gap-2">


              {/* dialog */}
              <EditEventDialog events={event}></EditEventDialog>
              <DeleteEventDialogPage event={event}></DeleteEventDialogPage>


            </div>

          )}

        </div>
        {/* Hero banner */}
        <div className="relative mt-5 overflow-hidden rounded-2xl">
          {event.thumbnail ? (
            <Image
              src={event.thumbnail}
              alt={event.title}
              width={1600}
              height={640}
              priority
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="h-56 w-full object-cover  sm:h-72 lg:h-80"
            />
          ) : (
            <div className="grid h-56 w-full place-items-center bg-linear-to-br from-[#2e9e5b] to-brand-deep sm:h-72 lg:h-80">
              <Leaf className="size-16 text-white/40" />
            </div>
          )}

          {/* Dark gradient so the text stays readable on any photo */}
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10" />

          <Badge className="absolute top-4 left-4 h-auto gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
            <CategoryIcon className={`size-3.5 ${category.iconClassName}`} />
            {category.label}
          </Badge>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <h1 className="font-heading text-2xl leading-tight font-bold text-white sm:text-3xl lg:text-4xl">
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/95">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-[#63e39a]" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-[#63e39a]" />
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Main content card */}
        <Card className="mt-5 gap-0 rounded-2xl bg-white p-0 shadow-[0_4px_24px_rgba(16,60,32,0.07)] ring-1 ring-black/5">
          <div className="p-5 sm:p-7">
            <EventJoinBar event={event} />

            <Separator className="my-6 bg-gray-100" />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
              {/* Left column */}
              <div className="min-w-0">
                <h2 className="font-heading text-xl font-bold text-gray-900 sm:text-2xl">
                  About this Event
                </h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-600">
                  {description}
                </p>

                <Separator className="my-6 bg-gray-100" />

                <div className="flex items-center gap-2.5">
                  <ClipboardList className="size-5 shrink-0 text-brand" />
                  <h2 className="font-heading text-lg font-bold text-gray-900">
                    Event Guidelines
                  </h2>
                </div>

                <ul className="mt-4 space-y-3">
                  {guidelines.map((guideline) => (
                    <li
                      key={guideline}
                      className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-gray-600"
                    >
                      <CircleCheck className="mt-0.5 size-5 shrink-0 fill-[#1f9d58] text-white" />
                      {guideline}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organizer panel */}
              <aside className="relative h-fit overflow-hidden rounded-2xl bg-gradient-to-b from-[#f0faf3] to-[#e3f5ea] p-5 ring-1 ring-[#cfeada]">
                <LeafCluster className="right-[-3.5rem] bottom-[-3rem] scale-125 text-[#a8dfbf] opacity-70" />

                <div className="relative">
                  <h2 className="flex items-center gap-2 font-heading text-base font-bold text-brand-dark">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    Event Organizer
                  </h2>

                  <div className="mt-4 flex items-center gap-3">
                    <OrganizerAvatar
                      src={user?.image || DEFAULT_AVATAR}
                      name={event.organizer}
                    />
                    <div className="min-w-0">
                      <p className="font-heading font-semibold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.organizerRole}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 flex items-center gap-2 text-sm break-all text-gray-600">
                    <Mail className="size-4 shrink-0 text-brand" />
                    {user?.email}
                  </p>

                  <Separator className="my-4 bg-[#cfeada]" />

                  <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand">
                      <ShieldCheck className="size-3.5 text-white" />
                    </span>
                    Verified Platform Member
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
