'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  if (pathname?.includes('/login') || pathname?.includes('/register')) {
    return null
  }

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-2">🍽️</span>
              <span className="text-2xl font-bold">CateringApp</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              Professional catering services for weddings, events, meetings, and special occasions. Quality food delivered with care.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/packages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Packages
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Jl. Catering Indah No. 123, Jakarta</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>info@cateringapp.com</span>
              </div>
              <div className="text-xs mt-2">
                Operating Hours: Mon-Sun 08:00 - 20:00
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CateringApp. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/delivery-policy" className="text-sm text-muted-foreground hover:text-foreground">
              Delivery Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}