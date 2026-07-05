import { Hero } from "@/components/marketing/hero"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { FeaturedBoxes } from "@/components/marketing/featured-boxes"
import { Testimonials } from "@/components/marketing/testimonials"
import { FinalCta } from "@/components/marketing/final-cta"
import { getFeaturedBoxes } from "@/lib/data/catalog"

export default async function Home() {
  const featuredBoxes = await getFeaturedBoxes()

  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedBoxes boxes={featuredBoxes} />
      <Testimonials />
      <FinalCta />
    </>
  )
}
