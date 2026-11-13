import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CalendarDays, Plus, Star, Users, UsersRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "cn"

const stats = [
  {
    icon: UsersRound,
    value: "4,520+",
    label: "Total Volunteers",
    color: "text-[#16a34a]",
    iconBg: "bg-[#dcfce7]",
  },
  {
    icon: CalendarDays,
    value: "1,250+",
    label: "Events Hosted",
    color: "text-[#0d9488]",
    iconBg: "bg-[#ccfbf1]",
  },
  {
    icon: Users,
    value: "12,800+",
    label: "People Helped",
    color: "text-[#4f46e5]",
    iconBg: "bg-[#e0e7ff]",
  },
  {
    icon: Star,
    value: "100%",
    label: "Community Driven",
    color: "text-[#f59e0b]",
    iconBg: "bg-[#fef3c7]",
  },
] as const

export default function Banner() {
  return (
    <section>
      {/* Hero */}
      <div className="bg-[linear-gradient(125deg,#e7f6ec_0%,#f1faf3_50%,#f8fdf9_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:px-8 lg:pt-16 lg:pb-16">
          {/* Copy */}
          <div>
            <Badge className="h-auto rounded-full bg-[#dff2e4] px-3.5 py-1.5 text-sm font-medium text-[#186034]">
              Small Actions <span className="mx-1 text-[#2e9e5b]">•</span> Big Impact
            </Badge>

            <h1 className="font-heading mt-6 text-4xl leading-[1.12] font-extrabold tracking-tight text-brand-deep sm:text-[2.6rem]">
              Together We Serve
              <span className="mt-1 block text-[#2e9e5b]">Build a Better Community</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
              Join hands with people who care. Discover, create and join community
              events that make a real difference.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
               nativeButton={false}
                render={<Link href="/upcoming-event" />}
                className="h-12 w-full gap-2 rounded-xl bg-[#1b5e20] px-6 text-base shadow-sm hover:bg-[#164c1a] sm:w-auto"
              >
                <CalendarDays className="size-[1.1rem]" />
                Explore Events
                <ArrowRight className="size-4" />
              </Button>
              <Button
              nativeButton={false}
                render={<Link href="/add-event" />}
                variant="outline"
                className="h-12 w-full gap-2 rounded-xl border-[#1b5e20]/25 bg-white px-6 text-base text-[#15521c] hover:border-[#1b5e20]/45 hover:bg-[#1b5e20]/5 sm:w-auto"
              >
                <Plus className="size-4" />
                Create Event
              </Button>
            </div>
          </div>

          {/* Photo — blob frame, leaves and handwritten caption are baked into the image */}
          <div className="mx-auto w-full max-w-[40rem]">
            <Image
              src="/images/Together We Grow and Smile.png"
              alt="Volunteers in green shirts planting a sapling together"
              width={963}
              height={531}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card
                  key={stat.label}
                  className="flex-row items-center gap-4 rounded-2xl px-5 py-4 shadow-[0_1px_3px_rgba(15,40,25,0.06)] ring-black/5"
                >
                  <span
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-full",
                      stat.iconBg
                    )}
                  >
                    <Icon className={cn("size-5.5", stat.color)} />
                  </span>
                  <div className="min-w-0">
                    <p className={cn("font-heading text-2xl font-bold tracking-tight", stat.color)}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
