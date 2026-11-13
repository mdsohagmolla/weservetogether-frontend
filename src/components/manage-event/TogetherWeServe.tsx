import { Heart } from "lucide-react"

/** Closing rule with the "Together We Serve" motto. */
export default function TogetherWeServe() {
  return (
    <div className="mt-14 flex items-center justify-center gap-4">
      <span className="h-px w-16 bg-[#bfe3ce] sm:w-40" />
      <span className="font-heading flex items-center gap-2 text-sm font-semibold text-[#1f9d58]">
        Together We Serve
        <Heart className="size-4 fill-[#1f9d58] text-[#1f9d58]" />
      </span>
      <span className="h-px w-16 bg-[#bfe3ce] sm:w-40" />
    </div>
  )
}
