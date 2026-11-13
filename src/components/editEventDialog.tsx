'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Pencil } from "lucide-react";
import { SyntheticEvent, useState,  type ReactNode } from "react"




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
import { toast } from "sonner";
import { EventDetail } from "@/app/upcoming-event/[id]/page";
import { useRouter } from "next/navigation";
import { getTokenFromClient } from "@/lib/getTokenFromClient";


// todo: 
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
            {hint ? <span className="text-xs text-gray-500">{hint}</span> : null}
            {error ? <span className="text-xs font-medium text-red-500">{error}</span> : null}
        </div>
    )
}

const inputClassName =
    "h-10 border-gray-200 bg-white px-3 md:text-sm"



const EditEventDialog = ({events}:{events:EventDetail}) => {
  

     const router = useRouter(); 

    // todo
    const today = toIsoDate(new Date())
    const [form, setForm] = useState<FormState>(events)
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

        // get token : 
        const token = await getTokenFromClient();
        
        

        // Send Data Backend server:

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upcoming-event/${events.id}`, {
            method: 'PATCH',
            headers: {
                'content-Type': "application/json",
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });
        // Add toast






        const data = await res.json();
        
        if (data.acknowledged === true) {
            toast.success("Event Edited Successfully !");
        }
          router.push('/upcoming-event');


        

        const nextErrors = validate(form, today)
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) {
            setSuccess(null)
            return
        }

        setSuccess(form.title.trim())
        setForm(EMPTY_FORM)
    }


    // todo 
    return (
        <div>
            <Dialog>
                <DialogTrigger
                    render={<Button

                        className="inline-flex items-center gap-2 rounded-lg border border-brand px-4 py-2 text-sm font-medium "
                    >
                        <Pencil className="size-4" />
                        Edit
                    </Button>}>


                </DialogTrigger>
                <DialogContent className="
    w-[calc(100vw-2rem)]
    max-w-xl
    max-h-[90dvh]
    overflow-y-auto
    p-4
    sm:p-6
  ">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
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
                            Edit Event
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditEventDialog;