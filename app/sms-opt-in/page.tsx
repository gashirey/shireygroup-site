'use client'

import { useState } from 'react'

export default function SmsOptIn() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  })
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      setError('You must agree to receive SMS messages.')
      return
    }

    const res = await fetch('/api/opt-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      setError('Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">You're signed up!</h2>
          <p className="text-gray-600">You'll receive SMS updates from SEG. Reply STOP anytime to unsubscribe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">SEG Deployment Alerts</h1>
        <p className="text-gray-600 mb-6">Sign up to receive SMS notifications for deployment opportunities.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="border rounded px-4 py-2"
            value={formData.first_name}
            onChange={e => setFormData({...formData, first_name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border rounded px-4 py-2"
            value={formData.last_name}
            onChange={e => setFormData({...formData, last_name: e.target.value})}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            className="border rounded px-4 py-2"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />

          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-1"
            />
            I agree to receive SMS messages from Shirey Enterprise Group (SEG). Reply STOP to unsubscribe. Msg & data rates may apply.
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-black text-white rounded px-4 py-2 font-medium hover:bg-gray-800"
          >
            Sign Up for Alerts
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          {' · '}
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </div>
  )
}