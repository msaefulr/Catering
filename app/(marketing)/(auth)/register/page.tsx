'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nama_pelanggan: '',
    email: '',
    password: '',
    telepon: '',
    tgl_lahir: '',
    alamat1: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { register, loading } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validasi
    if (!formData.nama_pelanggan || !formData.email || !formData.password) {
      setError('Nama, email, dan password wajib diisi')
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    const result = await register(formData)

    if (result.success) {
      setSuccess(result.message || 'Registrasi berhasil! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      setError(result.error || 'Registrasi gagal')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="text-6xl mb-2">🍽️</div>
          <CardTitle className="text-3xl font-bold">Daftar Akun</CardTitle>
          <CardDescription>
            Buat akun baru untuk memesan catering
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <Label htmlFor="nama_pelanggan">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama_pelanggan"
                  name="nama_pelanggan"
                  placeholder="John Doe"
                  value={formData.nama_pelanggan}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {/* Telepon */}
              <div className="space-y-2">
                <Label htmlFor="telepon">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telepon"
                  name="telepon"
                  type="tel"
                  placeholder="081234567890"
                  value={formData.telepon}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-2">
                <Label htmlFor="tgl_lahir">Tanggal Lahir</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.tgl_lahir && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.tgl_lahir ? format(new Date(formData.tgl_lahir), "PPP") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.tgl_lahir ? new Date(formData.tgl_lahir) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setFormData({
                            ...formData,
                            tgl_lahir: date.toISOString().split('T')[0]
                          })
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Alamat */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alamat1">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="alamat1"
                  name="alamat1"
                  placeholder="Alamat lengkap Anda"
                  value={formData.alamat1}
                  onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                  required
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full text-lg py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sedang mendaftar...
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Sudah punya akun?
                </p>
                <Link
                  href="/login"
                  className="text-primary hover:underline font-semibold text-lg"
                >
                  Login di sini
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}