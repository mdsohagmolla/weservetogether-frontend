import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import JoinedEvents, { type JoinedEvent } from "@/components/JoinedEvents"
import { getTokenFromServer } from "@/lib/getTokenFromServer"

export const metadata: Metadata = {
  title: "Joined Events | TogetherWeServe",
  description:
    "Track every social development and community service drive you have signed up for, sorted by event date.",
}

const JOIN_EVENT_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/join-event`

/** Sample commitments matching the design, used when the API is unreachable. */
const FALLBACK_JOINED_EVENTS: JoinedEvent[] = [
  
  
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

  return {
    // The booking document carries the event id in `id`; `_id` is the booking's own id.
    id: String(raw.id ?? raw._id ?? `joined-${index}`),
    title,
    type: typeof raw.type === "string" ? raw.type : "",
    date: typeof raw.date === "string" ? raw.date : "",
    location: location || "Location to be announced",
    thumbnail: normalizeThumbnail(raw.thumbnail),
    description: typeof raw.description === "string" ? raw.description.trim() : "",
    joinedAt: typeof raw.bookingDate === "string" ? raw.bookingDate : "",
  }
}

function sortByEventDate(events: JoinedEvent[]): JoinedEvent[] {
  return [...events].sort((a, b) =>
    (a.date || "9999-99-99").localeCompare(b.date || "9999-99-99")
  )
}

async function fetchJoinedEvents(email: string): Promise<JoinedEvent[]> {
  // get token : 
  const token = await getTokenFromServer();
  try {
    const res = await fetch(
      `${JOIN_EVENT_API_URL}/${encodeURIComponent(email)}`,
      { 
        headers: {
          authorization: `Bearer ${token}`

        },
        
        cache: "no-store" 
      }
    )
    if (!res.ok) {
      throw new Error(`Join-event API responded with status ${res.status}`)
    }

    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      throw new Error("Join-event API returned a non-array response")
    }

    const joined = data
      .map((item, index) => normalizeBooking(item as ApiBooking, index))
      .filter((event): event is JoinedEvent => event !== null)

    return sortByEventDate(joined)
  } catch (error) {
    console.warn(
      "Could not load joined events from the API — showing sample commitments instead.",
      error
    )
    return FALLBACK_JOINED_EVENTS
  }
}

const JoinEventPage = async () => {
  // get session
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const email = session?.user?.email

  const events = email ? await fetchJoinedEvents(email) : []

  return <JoinedEvents events={events} isSignedIn={Boolean(email)} />;
};

export default JoinEventPage;
