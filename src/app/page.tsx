import Banner from "@/components/home/Banner"
import FeatureEventPage from "@/components/home/featureEvent"

import Moments from "@/components/home/Moments"

import Testimonials from "@/components/home/Testimonials"
import WhyChooseUs from "@/components/home/WhyChooseUs"

export default function Home() {
  return (
    <>
      
      <main>
        <Banner />
        <WhyChooseUs />
        <FeatureEventPage></FeatureEventPage>
        <Moments />
        <Testimonials />
      </main>
      
    </>
  )
}
