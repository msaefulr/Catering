'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Package {
  id: bigint
  nama_paket: string
  jenis: string
  kategori: string
  jumlah_pax: number
  harga_paket: number
  deskripsi: string
  foto1?: string
}

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/packages/public')
      .then(res => res.json())
      .then(data => {
        setPackages(data.packages || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="text-8xl mb-6">🍽️</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Professional Catering Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Delicious food, perfect for any occasion. From weddings to corporate events, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages">
              <Button size="lg" className="text-lg">
                View Our Packages
              </Button>
            </Link>
            <Link href="/orders/new">
              <Button size="lg" variant="outline" className="text-lg">
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Popular Packages</h2>
            <p className="text-muted-foreground">Choose from our best-selling catering packages</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.slice(0, 6).map((pkg) => (
                <Card key={pkg.id.toString()} className="hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    {pkg.foto1 ? (
                      <img 
                        src={pkg.foto1} 
                        alt={pkg.nama_paket} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{pkg.nama_paket}</CardTitle>
                    <CardDescription>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Badge variant="secondary">{pkg.jenis}</Badge>
                        <Badge variant="outline">{pkg.kategori}</Badge>
                        <Badge variant="outline">{pkg.jumlah_pax} Pax</Badge>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary mb-2">
                      Rp {pkg.harga_paket.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {pkg.deskripsi}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/packages/${pkg.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/packages">
              <Button variant="outline" size="lg">
                View All Packages →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground">
              We provide the best catering services for your special events
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="text-6xl mb-4 text-primary">👨‍🍳</div>
                <CardTitle>Expert Chefs</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Our team of professional chefs creates delicious, high-quality meals for every occasion.
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-6xl mb-4 text-primary">🚚</div>
                <CardTitle>Reliable Delivery</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                On-time delivery with professional couriers to ensure your food arrives fresh and hot.
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-6xl mb-4 text-primary">💰</div>
                <CardTitle>Flexible Payment</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Multiple payment options to make your transaction convenient and secure.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let us make your event memorable with our delicious catering services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders/new">
              <Button size="lg" variant="secondary" className="text-lg">
                Place Your Order
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}