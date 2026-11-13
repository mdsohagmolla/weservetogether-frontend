"use client"

import { SyntheticEvent, useState,  type ReactNode } from "react"
import Image from "next/image"
import { LeafCluster } from "@/components/leaf-cluster"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  CalendarDays,

  Heart,
  Image as ImageIcon,
  
  MapPin,
  Send,
  Type as TypeIcon,
} from "lucide-react"
import { cn } from "cn"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

const EVENT_TYPES = [
  { value: "food-distribution", label: "Food Distribution" },
  { value: "clothing-distribution", label: "Clothing Distribution" },
  { value: "blood-donation", label: "Blood Donation" },
  { value: "tree-planting", label: "Tree Planting" },
  { value: "education-training", label: "Education & Training" },
  { value: "healthcare-awareness", label: "Healthcare & Awareness" },
  { value: "cleanliness-drive", label: "Cleanliness Drive" },
  { value: "disaster-relief", label: "Disaster Relief" },
  { value: "animal-welfare", label: "Animal Welfare" },
  { value: "community-gathering", label: "Community Gathering" },
] as const

type FormState = {
  title: string
  type: string
  date: string
  location: string
  thumbnail: string
  description: string
}

const EMPTY_FORM: FormState = {
  title: "",
  type: "",
  date: "",
  location: "",
  thumbnail: "",
  description: "",
}

function toIsoDate(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

function validate(form: FormState, today: string) {
  const errors: Record<string, string> = {}

  if (!form.title.trim()) {
    errors.title = "Please enter an event title."
  } else if (form.title.trim().length < 5) {
    errors.title = "Title should be at least 5 characters."
  }

  if (!form.type) {
    errors.type = "Please select an event type."
  }

  if (!form.date) {
    errors.date = "Please pick an event date."
  } else if (form.date < today) {
    errors.date = "Date must be today or later."
  }

  if (!form.location.trim()) {
    errors.location = "Please enter a location or venue."
  }

  if (!form.thumbnail.trim()) {
    errors.thumbnail = "Please enter a thumbnail image URL."
  } else if (!isValidHttpUrl(form.thumbnail.trim())) {
    errors.thumbnail = "Please enter a valid URL starting with http:// or https://."
  }

  if (!form.description.trim()) {
    errors.description = "Please describe your event."
  } else if (form.description.trim().length < 20) {
    errors.description = "Description should be at least 20 characters."
  }

  return errors
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-gray-800">
        {label} <span className="text-destructive">*</span>
      </Label>
      {children}
      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  )
}

const inputClassName =
  "h-10 border-gray-200 bg-white px-3 md:text-sm"

export default function AddEventForm() {

  // get session:
  const { data: session } = authClient.useSession();
  const user = session?.user

  const today = toIsoDate(new Date())
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)

  function setField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
    setSuccess(null)
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    // get jwt token 
    const token = await getTokenFromClient();
    

    // rquired;
    const isFormEmpty =
      !form.title.trim() ||
      !form.type.trim() ||
      !form.date ||
      !form.location.trim() ||
      !form.thumbnail.trim() ||
      !form.description.trim();

    if (isFormEmpty) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Send Data Backend server:

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-event`, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
         organizerEmail: user?.email,
      })
    });
    // Add toast




    const result = await res.json();
    
    if (result.acknowledged === true) {
      toast.success("Event Added Successfully !");
      redirect('/upcoming-event')
    }


    

    const nextErrors = validate(form, today)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSuccess(null)
      return
    }

    setSuccess(form.title.trim())
    setForm(EMPTY_FORM)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3faf6]">
      {/* Decorative background leaves */}
      <LeafCluster className="-bottom-10 -left-16 scale-160 text-[#9fdfbd] opacity-50" />
      <LeafCluster className="right-[-4.5rem] bottom-64 scale-150 -rotate-12 text-[#9fdfbd] opacity-40" />

      <div className="relative">
        {/* Hero */}
        <header className="relative overflow-hidden bg-[linear-gradient(125deg,#e7f6ec_0%,#f1faf3_50%,#f8fdf9_100%)]">
          <LeafCluster className="top-6 right-4 hidden scale-125 text-[#8ed9ab] opacity-50 lg:block" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-12 pb-14 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8 lg:px-8 lg:pt-14 lg:pb-16">
            <div>
              <Badge className="h-auto rounded-full bg-[#dff2e4] px-3.5 py-1.5 text-sm font-medium text-[#186034]">
                <CalendarDays />
                Organize <span className="mx-1 text-[#2e9e5b]">•</span> Support
                <span className="mx-1 text-[#2e9e5b]">•</span> Make an Impact
              </Badge>

              <h1 className="font-heading mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-brand-deep sm:text-[2.75rem]">
                Create a <span className="text-[#2e9e5b]">Community Event</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
                Bring people together for a greater cause. Organize a local event and
                help build a kinder, more supportive community.
              </p>

              <svg
                className="mt-4 h-5 w-44 text-[#2e9e5b]"
                viewBox="0 0 176 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 15C35 6 90 3 172 8"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Blob framed photo */}
            <div className="relative mx-auto w-full max-w-[28rem] lg:justify-self-end">
              <svg
                className="absolute -top-5 left-1 h-10 w-10 text-[#3fae68]"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 26l-4 5M15 19l-6 3M24 11l-3-6"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              <div
                className="overflow-hidden ring-[5px] ring-[#4fb877] shadow-[0_18px_40px_rgba(23,90,45,0.18)]"
                style={{ borderRadius: "54% 46% 48% 52% / 48% 50% 50% 52%" }}
              >
                <Image
                  src="/images/Together We Serve Volunteer Team.png"
                  alt="Volunteers in green shirts standing together"
                  width={1536}
                  height={1024}
                  className="aspect-[8/5] w-full object-cover"
                />
              </div>

              <LeafCluster className="top-1/2 -right-10 hidden -translate-y-1/2 rotate-45 text-[#6ecb90] opacity-80 lg:block" />
            </div>
          </div>
        </header>

        {/* Form card */}
        <main className="mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-5 shadow-[0_10px_40px_rgba(16,60,32,0.08)] ring-1 ring-black/5 sm:p-7 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[268px_1fr] lg:gap-8">
              {/* Motivational sidebar */}
              <aside className="relative overflow-hidden rounded-2xl bg-[#e9f6ee] px-6 pt-8 pb-10 text-center">
                <svg
                  viewBox="0 0 120 116"
                  className="mx-auto h-32 w-32"
                  aria-hidden="true"
                >
                  <path
                    d="M96 12l7-7M105 25l9-4M92 24v-10"
                    stroke="#3fae68"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M36 14v16M76 14v16"
                    stroke="#2f8f52"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <rect
                    x="16"
                    y="22"
                    width="80"
                    height="76"
                    rx="12"
                    fill="#ffffff"
                    stroke="#2f8f52"
                    strokeWidth="5"
                  />
                  <path
                    d="M16 34a12 12 0 0 1 12-12h56a12 12 0 0 1 12 12v12H16V34z"
                    fill="#45b56f"
                  />
                  <g fill="#b7e4c7">
                    <rect x="27" y="57" width="14" height="12" rx="3" />
                    <rect x="47" y="57" width="14" height="12" rx="3" />
                    <rect x="67" y="57" width="14" height="12" rx="3" />
                    <rect x="27" y="75" width="14" height="12" rx="3" />
                    <rect x="47" y="75" width="14" height="12" rx="3" />
                  </g>
                  <circle cx="88" cy="86" r="18" fill="#2f8f52" />
                  <path
                    d="M80 86l6 6 11-12"
                    stroke="#ffffff"
                    strokeWidth="4.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <h2 className="font-heading mt-6 text-xl font-bold leading-snug text-[#1d7a45]">
                  Let&apos;s Create Something Good Together!
                </h2>
                <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-gray-600">
                  Your event can bring positive change in your community.
                </p>

                <div className="mx-auto mt-6 h-px w-24 bg-[#b7e4c7]" />

                <svg
                  viewBox="0 0 120 64"
                  className="mx-auto mt-6 h-16 w-36 text-[#2f9e56]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="60" cy="22" r="12" />
                  <path d="M40 60c0-11 9-20 20-20s20 9 20 20v4H40z" />
                  <g opacity="0.75">
                    <circle cx="26" cy="30" r="9" />
                    <path d="M10 60c0-9 7-16 16-16s16 7 16 16v4H10z" />
                    <circle cx="94" cy="30" r="9" />
                    <path d="M78 60c0-9 7-16 16-16s16 7 16 16v4H78z" />
                  </g>
                </svg>

                <LeafCluster className="-bottom-3 -left-5 text-[#59bd7f] opacity-70" />
                <LeafCluster className="-right-5 -bottom-3 scale-x-[-1] text-[#7bcea0] opacity-70" />
              </aside>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">


                <Field label="Event Title" htmlFor="event-title" error={errors.title}>
                  <div className="relative">
                    <TypeIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="event-title"
                      value={form.title}
                      onChange={(event) => setField("title", event.target.value)}
                      placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                      aria-invalid={errors.title ? true : undefined}
                      className={cn(inputClassName, "pl-9")}
                      required
                    />
                  </div>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Event Type"
                    htmlFor="event-type"
                    error={errors.type}
                  >
                    <Select
                      value={form.type || null}
                      onValueChange={(value) => setField("type", value ?? "")}
                      items={EVENT_TYPES}
                    >
                      <SelectTrigger
                        id="event-type"
                        aria-invalid={errors.type ? true : undefined}
                        className={cn(
                          "h-10 w-full border-gray-200 bg-white pl-3",
                          errors.type && "border-destructive"
                        )}
                      >
                        <Heart className="fill-gray-900 text-gray-900" />
                        <SelectValue placeholder="Select Event Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map((eventType) => (
                          <SelectItem key={eventType.value} value={eventType.value}>
                            {eventType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field
                    label="Event Date"
                    htmlFor="event-date"
                    hint="Dates must be in the future (today or later)."
                    error={errors.date}
                  >
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="event-date"
                        type="date"
                        min={today}
                        value={form.date}
                        onChange={(event) => setField("date", event.target.value)}
                        aria-invalid={errors.date ? true : undefined}
                        className={cn(inputClassName, "pl-9")}
                      />
                    </div>
                  </Field>
                </div>

                <Field
                  label="Location / Venue"
                  htmlFor="event-location"
                  error={errors.location}
                >
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="event-location"
                      value={form.location}
                      onChange={(event) => setField("location", event.target.value)}
                      placeholder="e.g. Mohammadpur Town Hall, Dhaka"
                      aria-invalid={errors.location ? true : undefined}
                      className={cn(inputClassName, "pl-9")}
                    />
                  </div>
                </Field>

                <Field
                  label="Thumbnail Image URL"
                  htmlFor="event-thumbnail"
                  hint="Use a high-quality image URL for your event."
                  error={errors.thumbnail}
                >
                  <div className="relative">
                    <ImageIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="event-thumbnail"
                      type="url"
                      inputMode="url"
                      value={form.thumbnail}
                      onChange={(event) => setField("thumbnail", event.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      aria-invalid={errors.thumbnail ? true : undefined}
                      className={cn(inputClassName, "pl-9")}
                    />
                  </div>
                </Field>

                <Field
                  label="Event Description"
                  htmlFor="event-description"
                  error={errors.description}
                >
                  <Textarea
                    id="event-description"
                    rows={3}
                    value={form.description}
                    onChange={(event) => setField("description", event.target.value)}
                    placeholder="Explain the purpose of the event, the activities, and how people can participate..."
                    aria-invalid={errors.description ? true : undefined}
                    className="min-h-20 border-gray-200 bg-white md:text-sm"
                  />
                </Field>
                {/* email atach  */}
                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-base font-medium text-slate-500">
                    Organizer Email attached:
                  </span>

                  <span className="break-all text-base font-medium text-slate-500">
                    {user?.email}
                  </span>
                </div>

                {/* <Alert className="rounded-lg border-[#cdebd8] bg-[#e9f6ee] py-2.5 text-[#166534]">
                  <Info className="text-[#1f9d58]" />
                  <AlertDescription className="text-[#15572e]">
                    Organized events will be reviewed before publishing.
                  </AlertDescription>
                </Alert> */}

                <Button
                  type="submit"
                  className="h-12 w-full gap-2 rounded-xl bg-[#1b5e20] px-6 text-base font-semibold shadow-sm hover:bg-[#164c1a]"
                >
                  <Send />
                  Publish Event
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
