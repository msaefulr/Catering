import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { AuthProvider } from "@/components/layout/AuthProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
      weight: "100 900",
    },
    // Kalau kamu punya italic variable, aktifin ini:
    // {
    //   path: "../public/fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
    //   style: "italic",
    //   weight: "100 900",
    // },
  ],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Catering App - Professional Catering Services",
  description: "Manage your catering business with ease",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className}`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {children}
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
