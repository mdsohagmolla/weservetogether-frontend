import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import JoinedEventsView from "@/components/manage-event/JoinedEventsView"
import type { JoinedEvent } from "@/components/manage-event/types"

export const metadata: Metadata = {
  title: "Manage Events | TogetherWeServe",
  description:
    "Review every social development and community service drive you have signed up for, sorted by event date.",
}

const MANAGE_EVENT_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/manage-event`

/** Sample commitments matching the design, used when the API is unreachable. */
const FALLBACK_JOINED_EVENTS: JoinedEvent[] = [
  {
    id: "clean-our-neighborhood-campaign",
    title: "Community Cleanup Drive",
    type: "cleanliness-drive",
    date: "2026-11-15",
    location: "Mirpur 10, Dhaka",
    thumbnail: "/images/Together We Serve Community Day.png",
    description: "Let's keep our community clean and green together.",
    joinedAt: "2026-11-10",
  },
  {
    id: "food-distribution-for-street-children",
    title: "Food Distribution for Children",
    type: "education-training",
    date: "2026-11-16",
    location: "Mohammadpur, Dhaka",
    thumbnail: "/images/Together We Serve Volunteer Team.png",
    description:
      "Provide nutritious food to underprivileged children in our community.",
    joinedAt: "2026-11-09",
  },
  {
    id: "winter-clothes-distribution-mirpur-10",
    title: "Winter Clothes Distribution",
    type: "clothing-distribution",
    date: "2026-11-18",
    location: "Dhanmondi, Dhaka",
    thumbnail: "/images/winter clothes distribution.png",
    description: "Share warmth this winter with those in need.",
    joinedAt: "2026-11-08",
  },
]

type ApiBooking = {
  _id?: string
  id?: string
  title?: string
  type?: string
  date?: string
  location?: string
  thumbnail?: string
  description?: string
  bookingDate?: string
  joinedAt?: string
}

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

function normalizeBooking(raw: ApiBooking, index: number): JoinedEvent | null {
  if (!raw || typeof raw !== "object") return null

  const title = typeof raw.title === "string" ? raw.title.trim() : ""
  if (!title) return null

  const location = typeof raw.location === "string" ? raw.location.trim() : ""
  const joinedAt =
    typeof raw.bookingDate === "string"
      ? raw.bookingDate
      : typeof raw.joinedAt === "string"
        ? raw.joinedAt
        : ""

  return {
    // The booking document carries the event id in `id`; `_id` is the booking's own id.
    id: String(raw.id ?? raw._id ?? `joined-${index}`),
    title,
    type: typeof raw.type === "string" ? raw.type : "",
    date: typeof raw.date === "string" ? raw.date : "",
    location: location || "Location to be announced",
    thumbnail: normalizeThumbnail(raw.thumbnail),
    description: typeof raw.description === "string" ? raw.description.trim() : "",
    joinedAt,
  }
}

function sortByEventDate(events: JoinedEvent[]): JoinedEvent[] {
  return [...events].sort((a, b) =>
    (a.date || "9999-99-99").localeCompare(b.date || "9999-99-99")
  )
}

async function fetchManagedEvents(email: string): Promise<JoinedEvent[]> {
  try {
    const res = await fetch(
      `${MANAGE_EVENT_API_URL}/${encodeURIComponent(email)}`,
      { cache: "no-store" }
    )
    if (!res.ok) {
      throw new Error(`Manage-event API responded with status ${res.status}`)
    }

    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      throw new Error("Manage-event API returned a non-array response")
    }

    const joined = data
      .map((item, index) => normalizeBooking(item as ApiBooking, index))
      .filter((event): event is JoinedEvent => event !== null)

    return sortByEventDate(joined)
  } catch (error) {
    console.warn(
      "Could not load managed events from the API — showing sample commitments instead.",
      error
    )
    return FALLBACK_JOINED_EVENTS
  }
}

const ManageEventPage = async () => {
  // get session
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const email = session?.user?.email

  const events = email ? await fetchManagedEvents(email) : []

  return <JoinedEventsView events={events} isSignedIn={Boolean(email)} />
}

export default ManageEventPage
