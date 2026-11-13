import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CircleCheck } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(16,60,32,0.06)] ring-1 ring-black/5">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e6f4ea]">
        <CircleCheck className="size-6 text-[#1f9d58]" />
      </span>
      <h2 className="font-heading mt-4 text-lg font-semibold text-gray-900">
        No commitments yet
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
        Events you join will show up here so you never miss a drive you signed up
        for.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/upcoming-event" />}
        className="mt-6 h-11 gap-2 rounded-xl px-6 text-sm font-semibold sm:text-base"
      >
        Browse Events
        <ArrowRight className="size-4" />
      </Button>
    </div>
  )
}
