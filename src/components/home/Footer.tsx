import type { ComponentType } from "react"
import Link from "next/link"
import { Heart, Leaf, Mail, MapPin } from "lucide-react"

type Social = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "#upcoming-events" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
]

// lucide no longer ships brand icons, so the social marks are hand-drawn SVGs
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      {/* solid disc with the "f" knocked out */}
      <mask id="footer-fb-mask">
        <circle cx="12" cy="12" r="10" fill="white" />
        <path
          transform="translate(12 12) scale(0.7) translate(-12 -12)"
          d="M13.5 21v-8.2h2.8l.42-3.2H13.5V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.13c-.3-.04-1.3-.13-2.46-.13-2.44 0-4.11 1.49-4.11 4.22V9.6H7.4v3.2h2.76V21h3.34Z"
          fill="black"
        />
      </mask>
      <circle cx="12" cy="12" r="10" mask="url(#footer-fb-mask)" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.5 3.56 12 3.56 12 3.56s-7.5 0-9.4.52A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.12c1.9.52 9.4.52 9.4.52s7.5 0 9.4-.52a3 3 0 0 0 2.1-2.12c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.54V8.46L15.8 12l-6.2 3.54Z"
      />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723 10.016 10.016 0 0 1-3.127 1.184 4.92 4.92 0 0 0-8.384 4.482A13.94 13.94 0 0 1 1.64 3.162 4.822 4.822 0 0 0 3.194 9.6a4.9 4.9 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417A9.867 9.867 0 0 1 1.17 19.61a13.945 13.945 0 0 0 7.548 2.209c9.058 0 14.01-7.496 14.01-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59Z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  )
}

const socials: Social[] = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
  { label: "Twitter", href: "#", icon: TwitterIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#0f6236] via-[#0d5730] to-[#0a4627] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-start gap-3">
              <span className="relative grid size-9 place-items-center">
        <Heart className="size-8 fill-[#2f9e5e] text-[#2f9e5e]" strokeWidth={1} />
        <Leaf
          aria-hidden
          className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-[45%] -rotate-15 text-white"
          strokeWidth={2.5}
        />
      </span>
              <span>
                <span className="font-heading block text-2xl font-bold tracking-tight text-white">
                  TogetherWeServe
                </span>
                <span className="mt-1 block text-sm text-white/80">
                  Serve • Support • Grow
                </span>
              </span>
            </Link>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-base font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Follow Us */}
          <div>
            <h3 className="text-base font-semibold text-white">Follow Us</h3>
            <ul className="mt-3 flex items-center gap-4">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="block text-white transition-opacity hover:opacity-75"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-base font-semibold text-white">Contact Us</h3>
            <ul className="mt-3 space-y-3 text-[0.95rem] text-white/85">
              <li className="flex items-center gap-2.5">
                <Mail aria-hidden className="size-4.5 shrink-0 text-white" />
                <a
                  href="mailto:hello@togetherweserve.org"
                  className="transition-colors hover:text-white"
                >
                  hello@togetherweserve.org
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin aria-hidden className="size-4.5 shrink-0 text-white" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="mt-8 border-white/20" />

        <div className="flex flex-col gap-2 pt-4 pb-1 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2025 TogetherWeServe. All rights reserved.</p>
          <p>
            Together for a Better Community <span aria-hidden>❤️</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
