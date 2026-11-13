import type { Metadata } from "next"
import AddEventForm from "@/components/AddEventForm"

export const metadata: Metadata = {
  title: "Create an Event | TogetherWeServe",
  description:
    "Organize a local community event. Bring people together for a greater cause and help build a kinder, more supportive community.",
}

const AddEventPage = () => {
  return <AddEventForm />;
};

export default AddEventPage;
