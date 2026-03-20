'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function SmsOptIn() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      setError('You must agree to receive SMS messages to continue.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/opt-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="text-center max-w-md">
          <Image
            src="/seg_logo_color_full.png"
            alt="Shirey Enterprise Group"
            width={200}
            height={80}
            className="mx-auto mb-8 object-contain"
          />
          <div
            className="rounded-lg px-8 py-6 border"
            style={{ borderColor: '#C4891A', backgroundColor: 'rgba(196,137,26,0.08)' }}
          >
            <svg
              className="mx-auto mb-4 h-12 w-12"
              style={{ color: '#C4891A' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#E8E0D0' }}>
              You&rsquo;re signed up.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#A89880' }}>
              You&rsquo;ll receive SMS alerts from SEG for deployment opportunities and operational updates. Reply{' '}
              <span className="font-semibold" style={{ color: '#E8E0D0' }}>STOP</span> at any time to unsubscribe.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/seg_logo_color_full.png"
            alt="Shirey Enterprise Group"
            width={220}
            height={88}
            className="object-contain"
          />
        </div>

        {/* Header copy */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4" style={{ color: '#E8E0D0' }}>
            SEG Deployment Alerts
          </h1>
          <p className="text-base leading-relaxed mb-4" style={{ color: '#A89880' }}>
            Shirey Enterprise Group fields independent contractors into storm response and utility base camp deployments
            across the U.S. through our partner Recovery Logistics (RLI).
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#7A6E62' }}>
            SMS alerts notify our team of incoming deployment opportunities, standby notices, and stand-down updates.
            Message frequency varies — periods may be quiet for weeks, then multiple messages in a single day during
            active events.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-xl border p-8"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(196,137,26,0.3)' }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#A89880' }}>
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane"
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                  className="rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 transition"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(196,137,26,0.25)',
                    color: '#E8E0D0',
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#A89880' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Smith"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  className="rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 transition"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(196,137,26,0.25)',
                    color: '#E8E0D0',
                  }}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#A89880' }}>
                Mobile Phone
              </label>
              <input
                type="tel"
                required
                placeholder="(555) 000-0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(196,137,26,0.25)',
                  color: '#E8E0D0',
                }}
              />
            </div>

            {/* Consent */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => {
                  setConsent(e.target.checked)
                  if (error) setError('')
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded accent-amber-500 cursor-pointer"
              />
              <span className="text-xs leading-relaxed" style={{ color: '#7A6E62' }}>
                I agree to receive SMS messages from Shirey Enterprise Group (SEG) regarding deployment opportunities
                and operational updates. Reply STOP to unsubscribe. Reply HELP for help. Msg &amp; data rates may apply.
              </span>
            </label>

            {/* Error */}
            {error && (
              <p className="text-sm font-medium" style={{ color: '#E05252' }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-md px-6 py-3 text-sm font-semibold tracking-wide transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#C4891A', color: '#0D1B2A' }}
            >
              {loading ? 'Submitting…' : 'Sign Up for Alerts'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs" style={{ color: '#4A4035' }}>
          <a href="/privacy" className="hover:underline transition-colors" style={{ color: '#7A6E62' }}>
            Privacy Policy
          </a>
          <span className="mx-2" style={{ color: '#4A4035' }}>·</span>
          <a href="/sms-policy" className="hover:underline transition-colors" style={{ color: '#7A6E62' }}>
            SMS Policy
          </a>
        </div>

      </div>
    </main>
  )
}
