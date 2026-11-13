import type { LucideIcon } from "lucide-react"
import { CirclePlus, Handshake, Heart, UsersRound } from "lucide-react"
import { cn } from "cn"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
  iconClassName?: string
}

const features: Feature[] = [
  {
    icon: UsersRound,
    title: "Find Local Events",
    // line breaks mirror the design's fixed two-line copy
    description: "Discover events near you\nand get involved.",
  },
  {
    icon: CirclePlus,
    title: "Create Your Own",
    description: "Organize events and\nbring change to your area.",
  },
  {
    icon: Handshake,
    title: "Build Connections",
    description: "Meet like-minded people\nand grow your network.",
  },
  {
    icon: Heart,
    title: "Create Real Impact",
    description: "Together we can build\nstronger communities.",
    // the design shows the heart in a deeper green, solid fill
    iconClassName: "text-[#157a48] fill-current",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold tracking-[0.18em] text-[#2e9e5b] uppercase">
            Why Choose Us
          </p>
          <h2 className="font-heading mt-4 text-3xl font-extrabold tracking-tight text-brand-deep sm:text-4xl lg:text-[2.5rem]">
            Together We Make a Difference
          </h2>
          <p className="mx-auto mt-4 max-w-[36rem] text-base leading-relaxed text-gray-600">
            Our platform makes it easy to find, join, and create meaningful
            events that support people and communities in need.
          </p>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:mt-16 lg:grid-cols-4 lg:gap-0">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={cn(
                  "flex flex-col items-center px-2 text-center sm:px-6 lg:px-8",
                  index > 0 && "lg:border-l lg:border-gray-200"
                )}
              >
                <span className="grid size-[4.5rem] place-items-center rounded-[1.4rem] bg-brand-soft">
                  <Icon
                    className={cn("size-7 text-[#2e9e5b]", feature.iconClassName)}
                  />
                </span>
                <h3 className="font-heading mt-5 text-lg font-bold text-brand-deep">
                  {feature.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[17rem] text-[0.95rem] leading-relaxed whitespace-pre-line text-gray-500">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
