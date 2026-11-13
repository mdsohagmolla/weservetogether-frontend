"use client"

import { useState } from "react"
import Link from "next/link"
import { Ghost, Heart, Leaf, Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

import { redirect, usePathname } from "next/navigation";

type NavLink = {
  label: string
  href: string
  active?: boolean
}

const navLinks: NavLink[] = [

  { label: "Upcoming Events", href: "/upcoming-event" },
  { label: "Create Event", href: "/add-event" },
  { label: "Manage Events", href: "/manage-event" },
  { label: "Joined Events", href: "/join-event" },
]

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5">
      <span className="relative grid size-9 place-items-center">
        <Heart className="size-8 fill-[#2f9e5e] text-[#2f9e5e]" strokeWidth={1} />
        <Leaf
          aria-hidden
          className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-[45%] -rotate-15 text-white"
          strokeWidth={2.5}
        />
      </span>
      <span className="font-heading text-xl font-extrabold tracking-tight text-brand-deep">
        TogetherWeServe
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // get session:
  const { data: session } = authClient.useSession();
  const user = session?.user



  // Sign-out function

  const handleSignOut = () => {
    authClient.signOut();
    redirect('/')

  }

  // pathname
  const pathname = usePathname();


  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative py-1.5 text-[0.95rem] font-medium transition-colors hover:text-brand",
                  isActive
                    ? "text-brand after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-brand after:content-['']"
                    : "text-gray-600"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="text-gray-600 hover:text-brand"
          >
            <Search className="size-5" />
          </Button>

          {/* Avatar */}


          {/* popover */}

          {/* conditional rendering */}
          {
            user ? <Popover>
              <PopoverTrigger render={<button type="button">
                <Avatar>
                  <AvatarImage referrerPolicy="no-referrer" src={user?.image as string} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </button>
              }>

              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>{user?.name}</PopoverTitle>
                  <PopoverDescription>
                    {user?.email}<br></br>
                    <Button onClick={handleSignOut} variant={'destructive'} className='my-1'>Sign Out</Button>
                  </PopoverDescription>

                </PopoverHeader>
              </PopoverContent>
            </Popover> : <>
              <Link href={'/log-in'}>
                <Button
                  variant="outline"
                  className="hidden h-9 rounded-lg bg-white px-4 font-medium shadow-sm sm:inline-flex"
                >
                  Login
                </Button>
              </Link>

              <Link href={'/sign-up'}>
                <Button className="hidden h-9 rounded-lg px-4 font-medium sm:inline-flex">
                  Register
                </Button>
              </Link>
            </>
          }







          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-soft text-brand-dark font-semibold"
                      : "text-gray-700 hover:bg-brand-soft hover:text-brand-dark"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {
            user ? "" : <>
            <div className="mt-3 flex gap-3">
            <Button
              variant="outline"
              className="h-9 flex-1 rounded-lg bg-white shadow-sm"
            >
              Login
            </Button>
            <Button className="h-9 flex-1 rounded-lg">Register</Button>
          </div>
            
            </>
          }
          
        </div>
      )}
    </header>
  )
}
