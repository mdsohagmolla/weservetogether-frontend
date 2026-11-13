import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf } from "@/components/leaf-cluster"
import { getCategoryStyle } from "@/components/UpcomingEvents"
import type { JoinedEvent } from "@/components/manage-event/types"
import { ArrowRight, CalendarDays, MapPin, UserRound } from "lucide-react"
import { cn } from "cn"

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

export default function JoinedEventCard({ event }: { event: JoinedEvent }) {
  const category = getCategoryStyle(event.type)
  const CategoryIcon = category.icon
  const chip = CATEGORY_CHIP[event.type] ?? DEFAULT_CHIP

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

        <Button
          nativeButton={false}
          render={<Link href={`/upcoming-event/${event.id}?from=manage`} />}
          className="h-11 w-full gap-2 rounded-lg text-sm font-semibold sm:text-base"
        >
          View Event
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
