import EmptyState from "@/components/manage-event/EmptyState"
import JoinedEventCard from "@/components/manage-event/JoinedEventCard"
import JoinedEventsHeader from "@/components/manage-event/JoinedEventsHeader"
import SignedOutState from "@/components/manage-event/SignedOutState"
import TogetherWeServe from "@/components/manage-event/TogetherWeServe"
import type { JoinedEvent } from "@/components/manage-event/types"

export default function JoinedEventsView({
  events,
  isSignedIn = true,
}: {
  events: JoinedEvent[]
  isSignedIn?: boolean
}) {
  return (
    <div className="min-h-screen bg-white">
      <JoinedEventsHeader events={events} />

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

        <TogetherWeServe />
      </main>
    </div>
  )
}
