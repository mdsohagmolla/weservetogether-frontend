import { cn } from "cn"

export function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21 3C10 3 3 10 3 21c11 0 18-7 18-18Z" />
    </svg>
  )
}

export function LeafCluster({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute block size-28", className)}
    >
      <Leaf className="absolute top-0 left-2 size-12 -rotate-[30deg] opacity-60" />
      <Leaf className="absolute top-7 left-14 size-16 rotate-15" />
      <Leaf className="absolute top-24 left-0 size-14 rotate-[65deg] opacity-80" />
    </span>
  )
}
