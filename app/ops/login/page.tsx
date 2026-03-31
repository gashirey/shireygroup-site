'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function OpsLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push('/ops/dashboard')
    router.refresh()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F7F7F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '400px',
          borderTop: '3px solid #C4891A',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Image
            src="/seg_logo_color_full.png"
            alt="Shirey Enterprise Group"
            width={140}
            height={46}
            style={{ maxHeight: '46px', width: 'auto', objectFit: 'contain', margin: '0 auto' }}
          />
          <p
            style={{
              marginTop: '16px',
              fontSize: '13px',
              color: '#6B7280',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            SEG Response Tool — Internal Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0D1B2A',
                marginBottom: '6px',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#0D1B2A',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#C4891A')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0D1B2A',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#0D1B2A',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#C4891A')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '13px',
                color: '#B91C1C',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#E5A93A' : '#C4891A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '11px 16px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget.style.backgroundColor = '#A87315')
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.currentTarget.style.backgroundColor = '#C4891A')
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
