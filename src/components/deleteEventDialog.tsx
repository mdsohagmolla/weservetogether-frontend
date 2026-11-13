'use client'

import { EventDetail } from "@/app/upcoming-event/[id]/page";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getTokenFromClient } from "@/lib/getTokenFromClient";

import { Trash2 } from "lucide-react";
import { redirect } from "next/navigation";

const DeleteEventDialogPage = ({event}:{event:EventDetail}) => {



    // Handle function
    const handleDelete = async()=>{
        const token = await getTokenFromClient();


        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upcoming-event/${event.id}`,{
             method: 'DELETE',
             headers:{
            
            authorization: `Bearer ${token}`
        },

        }) 
        const data = await res.json();
        console.log(data)
        redirect('/upcoming-event')
        
    }
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger render={<button
      
      className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
    >
      <Trash2 className="size-4" />
      Delete
    </button>}>
                    Show Dialog
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DeleteEventDialogPage;