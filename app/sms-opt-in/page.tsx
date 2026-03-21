'use client'

import { useState } from 'react'
import SiteLayout from '../components/SiteLayout'

const dmSans = { fontFamily: "'DM Sans', sans-serif" }
const barlowCondensed = { fontFamily: "'Barlow Condensed', sans-serif" }

export default function SmsOptIn() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [notice, setNotice] = useState('')   // amber — consent prompt
  const [error, setError] = useState('')     // red — API/network errors
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotice('')
    setError('')

    if (!consent) {
      setNotice('To receive SMS alerts, please check the consent box and resubmit.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/opt-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_agent: navigator.userAgent }),
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

  return (
    <SiteLayout>
      <main style={{ maxWidth: '768px', margin: '0 auto', width: '100%', padding: '48px 32px', boxSizing: 'border-box' }}>
        {submitted ? (

          /* Success state */
          <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F7F5] px-8 py-10 shadow-sm">
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
              <h2
                className="text-2xl font-bold mb-3"
                style={{ color: '#0D1B2A', ...barlowCondensed }}
              >
                You&rsquo;re signed up.
              </h2>
              <p className="text-sm leading-relaxed text-[#6B7280]" style={dmSans}>
                You&rsquo;ll receive SMS alerts from SEG for deployment opportunities and operational updates.
                Reply <span className="font-semibold text-[#0D1B2A]">STOP</span> at any time to unsubscribe.
              </p>
            </div>
          </div>

        ) : (

          /* Opt-in form */
          <div style={{ maxWidth: '520px', margin: '0 auto', width: '100%' }}>

            {/* Single card wrapping header + form */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #E5E7EB',
              borderTop: '3px solid #C4891A',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              overflow: 'hidden',
            }}>

              {/* Header section */}
              <div style={{
                padding: '28px 36px 24px',
                textAlign: 'center',
                borderBottom: '1px solid #F3F4F6',
                backgroundColor: '#FAFAFA',
              }}>
                <h1 style={{
                  color: '#0D1B2A',
                  fontSize: '28px',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  marginBottom: '10px',
                  ...barlowCondensed,
                }}>
                  Stay Ready. Stay Informed.
                </h1>
                <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.65, margin: 0, ...dmSans }}>
                  SMS alerts go out when deployment windows open, when standby is called, and when events stand
                  down. We also check in periodically throughout the year to keep our team current — even when
                  things are quiet. No marketing. No noise. Just the information you need, when you need it.
                </p>
              </div>

              {/* Form section */}
              <div style={{ padding: '28px 36px 32px' }}>
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                  {/* Name row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { label: 'First Name', key: 'first_name', placeholder: 'Jane' },
                      { label: 'Last Name',  key: 'last_name',  placeholder: 'Smith' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: '#6B7280',
                          ...dmSans,
                        }}>
                          {label}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={placeholder}
                          value={formData[key as 'first_name' | 'last_name']}
                          onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            padding: '9px 14px',
                            fontSize: '14px',
                            color: '#0D1B2A',
                            outline: 'none',
                            ...dmSans,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#6B7280',
                      ...dmSans,
                    }}>
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        padding: '9px 14px',
                        fontSize: '14px',
                        color: '#0D1B2A',
                        outline: 'none',
                        ...dmSans,
                      }}
                    />
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: '#F3F4F6', margin: '2px 0' }} />

                  {/* Consent */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={e => {
                        setConsent(e.target.checked)
                        if (notice) setNotice('')
                        if (error) setError('')
                      }}
                      style={{ marginTop: '2px', width: '15px', height: '15px', flexShrink: 0, accentColor: '#C4891A', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12px', lineHeight: 1.65, color: '#6B7280', ...dmSans }}>
                      I agree to receive SMS messages from Shirey Enterprise Group (SEG) regarding deployment
                      opportunities, operational updates, and periodic roster check-ins. Reply STOP to unsubscribe.
                      Reply HELP for help. Msg &amp; data rates may apply.
                    </span>
                  </label>

                  {/* Consent notice (amber) */}
                  {notice && (
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#92400E', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '6px', padding: '10px 14px', margin: 0, lineHeight: 1.5, ...dmSans }}>
                      {notice}
                    </p>
                  )}

                  {/* API/network error (red) */}
                  {error && (
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#DC2626', margin: 0, ...dmSans }}>
                      {error}
                    </p>
                  )}

                  {/* Submit — centered */}
                  <div style={{ textAlign: 'center', paddingTop: '4px' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: '#C4891A',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '11px 36px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                        letterSpacing: '0.02em',
                        ...dmSans,
                      }}
                    >
                      {loading ? 'Submitting…' : 'Sign Up for Alerts'}
                    </button>
                  </div>

                </form>
              </div>

            </div>

          </div>
        )}
      </main>
    </SiteLayout>
  )
}
