"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Heart, Quote, Star } from "lucide-react"
import { cn } from "cn"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

type Testimonial = {
  name: string
  role: string
  initials: string
  quote: string
  meta: string
}

const testimonials: Testimonial[] = [
  {
    name: "Rafiul Islam",
    role: "Volunteer",
    initials: "RI",
    quote:
      "“TogetherWeServe has given me a platform to do something good for society. The team is amazing!”",
    meta: "Joined in 2024",
  },
  {
    name: "Ayesha Akter",
    role: "Beneficiary",
    initials: "AA",
    quote:
      "“Thanks to TogetherWeServe, we received warm clothes this winter. It really made our day.”",
    meta: "Received Support in 2025",
  },
  {
    name: "Tanvir Hasan",
    role: "Community Member",
    initials: "TH",
    quote:
      "“An excellent platform for community service. Proud to be part of this initiative!”",
    meta: "Joined in 2023",
  },
  {
    name: "Sadia Rahman",
    role: "Volunteer",
    initials: "SR",
    quote:
      "“I started with a single event and now I coordinate weekly drives. Every small act adds up here.”",
    meta: "Joined in 2024",
  },
  {
    name: "Imran Hossain",
    role: "Donor",
    initials: "IH",
    quote:
      "“Giving here is transparent and effortless. I can always see where my support ends up.”",
    meta: "Donating since 2022",
  },
  {
    name: "Nusrat Jahan",
    role: "Volunteer",
    initials: "NJ",
    quote:
      "“The team treats every volunteer with respect. It genuinely feels like a second family.”",
    meta: "Joined in 2025",
  },
  {
    name: "Arif Chowdhury",
    role: "Community Member",
    initials: "AC",
    quote:
      "“From planting trees to winter drives, this community shows up when it matters most.”",
    meta: "Joined in 2022",
  },
  {
    name: "Farhana Akter",
    role: "Beneficiary",
    initials: "FA",
    quote:
      "“The education support kept my daughter in school this year. We will always be grateful.”",
    meta: "Received Support in 2024",
  },
  {
    name: "Mahmudul Karim",
    role: "Event Organizer",
    initials: "MK",
    quote:
      "“Organizing an event here took minutes, and half the neighbourhood showed up to help.”",
    meta: "Organizing since 2023",
  },
]

// the design shows a fixed three-dot pager under the carousel
const DOTS = 3
const FEATURED_INDEX = 1

function Stars() {
  return (
    <span
      className="mt-1.5 flex items-center gap-0.5"
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden
          className="size-4 fill-amber-400 text-amber-400"
        />
      ))}
    </span>
  )
}

function LeafSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M14 152C46 122 74 86 118 34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M118 34c-6-27-33-42-62-39 3 28 30 47 62 39Z"
        fill="currentColor"
      />
      <path
        d="M78 84C50 90 26 74 20 46c28-6 54 10 58 38Z"
        fill="currentColor"
      />
      <path
        d="M104 62c7-26 34-37 62-30-8 26-34 40-62 30Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Testimonials() {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const [snapCount, setSnapCount] = useState(1)

  useEffect(() => {
    if (!api) return

    const update = () => {
      setSelected(api.selectedScrollSnap())
      setSnapCount(Math.max(api.scrollSnapList().length, 1))
    }

    update()
    api.on("select", update)
    api.on("reInit", update)
    return () => {
      api.off("select", update)
      api.off("reInit", update)
    }
  }, [api])

  const maxSnap = snapCount - 1
  const activeDot =
    maxSnap === 0 ? 0 : Math.round((selected / maxSnap) * (DOTS - 1))

  const goToDot = (dot: number) => {
    if (!api || maxSnap === 0) return
    api.scrollTo(Math.round((dot * maxSnap) / (DOTS - 1)))
  }

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-gradient-to-b from-[#f6fbf8] via-[#f4fbf7] to-[#e9f6ee]"
    >
      {/* decorative leaf sprigs */}
      <LeafSprig className="pointer-events-none absolute -top-4 left-2 size-36 text-[#d5eddf] opacity-80 sm:size-44" />
      <LeafSprig className="pointer-events-none absolute -top-4 right-2 size-36 -scale-x-100 text-[#d5eddf] opacity-80 sm:size-44" />

      {/* soft wave along the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          aria-hidden
          className="h-24 w-full text-[#e6f6ec] sm:h-32"
        >
          <path
            fill="currentColor"
            d="M0 66C210 118 430 24 700 44c276 20 470 96 740 54v42H0V66Z"
          />
        </svg>
        <svg
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          aria-hidden
          className="-mt-16 h-24 w-full text-[#d6f0e1] sm:-mt-20 sm:h-32"
        >
          <path
            fill="currentColor"
            d="M0 96c250 34 470-44 748-30 258 13 432 74 692 40v34H0V96Z"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 pb-28 sm:px-6 lg:px-8 lg:pt-16 lg:pb-36">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e5f5eb] px-4 py-2 text-sm font-semibold text-[#157a48]">
            <Quote aria-hidden className="size-4 fill-current" />
            Testimonials
          </span>

          <h2 className="font-heading mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.75rem]">
            <span className="text-[#12482b]">What Other People </span>
            <span className="text-[#2f9e5e]">Say</span>
          </h2>

          <p className="mt-4 text-[0.95rem] leading-relaxed text-gray-600">
            Real stories. Real impact. Hear from our volunteers, beneficiaries
            and community members.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#8cc9a6]" />
            <Heart
              aria-hidden
              className="size-4 fill-[#1d9155] text-[#1d9155]"
            />
            <span className="h-px w-12 bg-[#8cc9a6]" />
          </div>
        </div>

        {/* Carousel */}
        <div className="relative mt-10 lg:mt-14">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: false }}
            className="mx-auto max-w-7xl"
          >
            <CarouselContent className="-ml-3 lg:items-center">
              {testimonials.map((testimonial, index) => {
                const featured = index === FEATURED_INDEX
                return (
                  <CarouselItem
                    key={testimonial.name}
                    className="basis-full pl-3 sm:basis-1/2 lg:basis-1/3"
                  >
                    <article
                      className={cn(
                        "flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_6px_24px_rgba(17,70,42,0.07)] ring-1 ring-black/[0.04] lg:p-6",
                        featured &&
                          "ring-2  shadow-[0_10px_30px_rgba(23,110,66,0.14)] lg:py-7"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#dcf3e6] to-[#bfe7d1] text-base font-bold text-[#166534] shadow-[0_2px_10px_rgba(20,80,45,0.12)] sm:size-16">
                          {testimonial.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading truncate text-lg font-bold text-[#12482b]">
                            {testimonial.name}
                          </p>
                          <p className="truncate text-sm font-medium text-[#2f9e5e]">
                            {testimonial.role}
                          </p>
                          <Stars />
                        </div>
                      </div>

                      <p className="mt-4 min-h-[4.5rem] text-[0.95rem] leading-relaxed text-gray-600">
                        {testimonial.quote}
                      </p>

                      <div className="mt-5">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e9f6ee] px-3 py-1.5 text-xs font-medium text-[#157a48]">
                          <CalendarDays aria-hidden className="size-3.5" />
                          {testimonial.meta}
                        </span>
                      </div>
                    </article>
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            <CarouselPrevious className="-left-3 size-9 rounded-full border-black/5 bg-white text-[#1d7e46] shadow-[0_6px_16px_rgba(17,70,42,0.16)] hover:bg-[#f1faf5] hover:text-[#166534] sm:-left-4 lg:-left-8 [&_svg]:size-5" />
            <CarouselNext className="-right-3 size-9 rounded-full border-black/5 bg-white text-[#1d7e46] shadow-[0_6px_16px_rgba(17,70,42,0.16)] hover:bg-[#f1faf5] hover:text-[#166534] sm:-right-4 lg:-right-8 [&_svg]:size-5" />
          </Carousel>
        </div>

        {/* Pager dots */}
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {Array.from({ length: DOTS }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToDot(index)}
              aria-label={`Go to testimonials page ${index + 1}`}
              aria-current={index === activeDot ? "true" : undefined}
              className={cn(
                "size-2.5 rounded-full transition-colors",
                index === activeDot
                  ? "bg-[#157a48]"
                  : "bg-[#b9e0c9] hover:bg-[#95cfad]"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
