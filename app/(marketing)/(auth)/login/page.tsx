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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'admin' | 'pelanggan'>('pelanggan')
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await login(email, password, userType)

    if (!result.success) {
      setError(result.error || 'Login failed')
      return
    }

    if (userType === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="text-center">
            <div className="text-6xl mb-2">🍽️</div>
            <CardTitle className="text-3xl font-bold">CateringApp</CardTitle>
            <CardDescription>Login to your account</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="pelanggan" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pelanggan" onClick={() => setUserType('pelanggan')}>
                  Customer
                </TabsTrigger>
                <TabsTrigger value="admin" onClick={() => setUserType('admin')}>
                  Admin/Staff
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={userType === 'admin' ? 'password' : 'katakunci'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </Button>
              </div>
            </Tabs>

            <div className="mt-6 pt-6 border-t">
              {userType === 'pelanggan' ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Don't have an account?</p>
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    Register as Customer
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Admin login only. Customers should use Customer mode.
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}