"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CalendarDays, Check, Share2, Users } from "lucide-react"
import { toast } from "sonner"
import { EventDetail } from "@/app/upcoming-event/[id]/page"
import { authClient } from "@/lib/auth-client"
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";




export default function EventJoinBar(  { event }:{event:EventDetail }) {


  console.log('event er data', event)
  const router = useRouter();

// get session 
const { data:session } = authClient.useSession()
const user  = session?.user



  const [joined, setJoined] = useState(false)

  // booking handle
  const handleBooking = async(e: MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();

    const data = {
      name: user?.name,
      email: user?.email,
      image: user?.image,
      ...event,
      bookingDate: new Date()
    }


    // Booking Api call
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`,{
       method : 'POST',
       headers: {
        'Content-Type':'application/json'
       },
        body: JSON.stringify(data)
    })
    
    const updatedData = await res.json()
    if (res.status===409) {
  toast.error("Event already added");
  return;
}
if (!res.ok) {
  toast.error(updatedData.message||'booking failed');
  return;
}

    toast.success("Joined successful!");
    
    
    console.log('backend data', updatedData)
    router.push('/join-event');


  }
  

  async function handleShare() {
    const url = window.location.href

    // Modern path: async clipboard API (available in secure contexts).
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        toast.success("Event link copied to clipboard")
        return
      }
    } catch {
      // Fall through to the legacy path below.
    }

    // Legacy path: hidden textarea + execCommand, for browsers or
    // contexts (permissions, plain http) where the clipboard API fails.
    try {
      const textarea = document.createElement("textarea")
      textarea.value = url
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand("copy")
      document.body.removeChild(textarea)

      if (copied) {
        toast.success("Event link copied to clipboard")
        return
      }
    } catch {
      // Give up and tell the user to copy the link manually.
    }

    toast.error("Could not copy the link — please copy it from the address bar.")
  }

  

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-soft">
          <Users className="size-6 text-brand" />
        </span>
        
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="icon"
          aria-label="Share this event"
          onClick={handleShare}
          
          className="size-11 rounded-xl border-gray-200 bg-white shadow-sm hover:bg-gray-50"
        >
          <Share2 className="size-5" />
        </Button>
        <Button
        onClick={handleBooking}
          
          className="h-11 gap-2 rounded-xl px-6 text-sm font-semibold shadow-sm sm:text-base"
        >
          {joined ? (
            <Check className="size-5" />
          ) : (
            <CalendarDays className="size-5" />
          )}
          {joined ? "Joined" : "Join Event"}
        </Button>
      </div>
    </div>
  )
}
