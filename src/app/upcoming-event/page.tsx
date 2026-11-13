import type { Metadata } from "next"
import UpcomingEvents, { type UpcomingEvent } from "@/components/UpcomingEvents"

export const metadata: Metadata = {
  title: "Upcoming Events | TogetherWeServe",
  description:
    "Discover verified volunteer initiatives scheduled for upcoming dates. Past events are automatically excluded so you can focus on active drives that need support.",
}

const EVENTS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/upcoming-event`

/** Sample data matching the design, used when the event API is unreachable. */
const FALLBACK_EVENTS: UpcomingEvent[] = [
  {
    id: "winter-clothes-distribution-mirpur-10",
    title: "Winter Clothes Distribution – Mirpur 10",
    type: "clothing-distribution",
    date: "2026-12-06",
    location: "Mirpur 10, Dhaka",
    thumbnail: "/images/winter clothes distribution.png",
    description:
      "Help us distribute warm clothes to underprivileged families in Mirpur. Together we can make a difference!",
    organizer: "TogetherWeServe",
    organizerEmail: ''
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
    organizer: "Green Volunteers",
    organizerEmail: ''
  },
  {
    id: "clean-our-neighborhood-campaign",
    title: "Clean Our Neighborhood Campaign",
    type: "cleanliness-drive",
    date: "2026-12-20",
    location: "Uttara Sector 7, Dhaka",
    thumbnail: "/images/Together We Serve Community Day.png",
    description:
      "Let's make our neighborhood cleaner and healthier for a better tomorrow.",
    organizer: "Community Care Team",
    organizerEmail: ''
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
  organizerEmail?:string
}

function normalizeThumbnail(thumbnail: unknown): string {
  if (typeof thumbnail !== "string") return ""
  const value = thumbnail.trim()
  if (value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://")) {
    return value
  }
  return ""
}

function normalizeEvent(raw: ApiEvent, index: number): UpcomingEvent | null {
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
    organizerEmail: raw.organizerEmail
  }
}

async function fetchUpcomingEvents(): Promise<UpcomingEvent[]> {
  try {
    const res = await fetch(EVENTS_API_URL, { 
      next:{
        revalidate:60,
      }
     })
    if (!res.ok) {
      throw new Error(`Event API responded with status ${res.status}`)
    }

    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      throw new Error("Event API returned a non-array response")
    }

    return data
      .map((item, index) => normalizeEvent(item as ApiEvent, index))
      .filter((event): event is UpcomingEvent => event !== null)
      .sort((a, b) => (a.date || "9999-99-99").localeCompare(b.date || "9999-99-99"))
  } catch (error) {
    console.warn(
      "Could not load upcoming events from the API — showing sample events instead.",
      error
    )
    return FALLBACK_EVENTS
  }
}

const UpcomingEventPage = async () => {
  const events = await fetchUpcomingEvents()

  return <UpcomingEvents events={events} />;
};

export default UpcomingEventPage;
