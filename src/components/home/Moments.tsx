import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const photos = [
  {
    src: "/images/Together We Serve Community Day.png",
    alt: "Volunteers in green shirts chatting together at a community event",
  },
  {
    src: "/images/Together We Serve Volunteer Team.png",
    alt: "A volunteer talking warmly with a young girl",
  },
  {
    src: "/images/Together We Serve_ Planting Hope-1.png",
    alt: "Volunteers holding the TogetherWeServe banner at a group gathering",
  },
  {
    src: "/images/Greener Community-2.png",
    alt: "Hands holding a young sapling with fresh soil",
  },
  {
    src: "/images/winter clothes distribution.png",
    alt: "Volunteers visiting children in a village street",
  },
]

export default function Moments() {
  return (
    <section className="bg-white pt-16 pb-6 lg:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#2e9e5b] uppercase">
              Our Gallery
            </p>
            <h2 className="font-heading mt-2 text-3xl font-extrabold tracking-tight text-brand-deep">
              Moments That Matter
            </h2>
            <p className="mt-3 text-[0.95rem] text-gray-600">
              A glimpse of our community work and the people behind the change.
            </p>
          </div>
          <Button
          nativeButton={false}
            render={<Link href="#gallery" />}
            variant="outline"
            className="h-9 shrink-0 gap-1.5 rounded-lg border-[#c7e4d2] bg-white px-4 text-sm font-medium text-[#166534] hover:border-[#a9d6ba] hover:bg-[#f2faf5] hover:text-[#166534]"
          >
            View Gallery
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3">
          {photos.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[3/2] overflow-hidden rounded-xl bg-brand-soft"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
