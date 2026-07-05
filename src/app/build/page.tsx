import type { Metadata } from "next"

import { BuilderWizard } from "@/components/builder/builder-wizard"
import { getBuilderCatalog } from "@/lib/data/catalog"

export const metadata: Metadata = {
  title: "Build Your Gift Box",
  description:
    "Design a bespoke, premium gift box — choose packaging, curate items, personalize with a note, and we deliver across Colombo.",
}

export default async function BuildPage() {
  const catalog = await getBuilderCatalog()

  return <BuilderWizard catalog={catalog} />
}
