"use client"

import * as React from "react"

import type { BuilderCatalog } from "@/lib/data/catalog"

const BuilderCatalogContext = React.createContext<BuilderCatalog | null>(null)

export function BuilderCatalogProvider({
  catalog,
  children,
}: {
  catalog: BuilderCatalog
  children: React.ReactNode
}) {
  return (
    <BuilderCatalogContext.Provider value={catalog}>
      {children}
    </BuilderCatalogContext.Provider>
  )
}

export function useBuilderCatalog() {
  const catalog = React.useContext(BuilderCatalogContext)
  if (!catalog) {
    throw new Error("useBuilderCatalog must be used within BuilderCatalogProvider")
  }
  return catalog
}
