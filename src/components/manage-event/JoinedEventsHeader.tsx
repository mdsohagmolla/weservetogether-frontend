import { Badge } from "@/components/ui/badge"
import CommitmentsArt from "@/components/manage-event/CommitmentsArt"
import { CircleCheck } from "lucide-react"
import { JoinedEvent } from "./types"

export default function JoinedEventsHeader({events}:{events: JoinedEvent[]}) {
  console.log('joinevent', events)
  return (
    <header className="relative overflow-hidden border-b border-[#e2efe7] bg-white">
      <CommitmentsArt className="pointer-events-none absolute top-0 right-0 hidden h-75 w-auto lg:block" />

      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
        <Badge className="h-auto gap-2 rounded-full bg-[#dff2e4] px-4 py-2 text-sm font-medium text-[#186034]">
          <CircleCheck />
          My Volunteer Commitments
        </Badge>

        <h1 className="font-heading mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-brand-deep sm:text-5xl lg:text-6xl">
          Manage Events
        </h1>
        <h2 className="font-semibold">You Created  {events.length} Events</h2>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
          Here are all the social development and community service drives you
          have signed up for, sorted by event date.
        </p>
      </div>
    </header>
  )
}
