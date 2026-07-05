import Link from "next/link"

import { Container } from "@/components/layout/container"
import { Logo } from "@/components/layout/logo"
import { SITE } from "@/lib/constants"

const FOOTER_SECTIONS = [
  {
    title: "Shop",
    links: [
      { href: "/build", label: "Build a Box" },
      { href: "/boxes", label: "Featured Boxes" },
      { href: "/#how-it-works", label: "How it Works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/contact", label: "Contact" },
      { href: "/delivery", label: "Delivery Areas" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/account/orders", label: "Track Order" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {SITE.tagline} Handcrafted gift boxes, delivered across {SITE.city}.
          </p>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-border/60">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Made with care in Colombo.</p>
        </Container>
      </div>
    </footer>
  )
}
