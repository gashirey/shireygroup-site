'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const NAV_ITEMS = [
  { href: '/ops/dashboard', label: 'Events' },
  { href: '/ops/contractors', label: 'Contractors' },
  { href: '/ops/availability', label: 'Availability' },
  { href: '/ops/hotlist', label: 'Hot List' },
  { href: '/ops/sms', label: 'SMS Signups' },
]

export default function OpsShell({
  children,
  userEmail,
}: {
  children: React.ReactNode
  userEmail: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/ops/login')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F7F7F5', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Top Bar */}
      <header style={{
        backgroundColor: '#0D1B2A',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '16px',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#FFFFFF',
          }}
          className="ops-hamburger"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <Image
            src="/seg_logo_color_full.png"
            alt="SEG"
            width={72}
            height={24}
            style={{ maxHeight: '24px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}>
            Response Tool
          </span>
        </div>

        {/* User info + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{userEmail}</span>
          <button
            onClick={handleSignOut}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #374151',
              borderRadius: '5px',
              color: '#D1D5DB',
              fontSize: '12px',
              fontWeight: 500,
              padding: '5px 12px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C4891A'
              e.currentTarget.style.color = '#C4891A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#374151'
              e.currentTarget.style.color = '#D1D5DB'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 30,
              display: 'none',
            }}
            className="ops-overlay"
          />
        )}

        {/* Sidebar */}
        <nav
          style={{
            width: '200px',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #E5E7EB',
            padding: '24px 0',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
          className={`ops-sidebar${sidebarOpen ? ' ops-sidebar-open' : ''}`}
        >
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#C4891A' : '#0D1B2A',
                  textDecoration: 'none',
                  borderLeft: active ? '3px solid #C4891A' : '3px solid transparent',
                  backgroundColor: active ? '#FFF8EE' : 'transparent',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#F7F7F5'
                    e.currentTarget.style.color = '#C4891A'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#0D1B2A'
                  }
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ops-hamburger { display: block !important; }
          .ops-sidebar {
            position: fixed !important;
            top: 52px !important;
            left: 0 !important;
            bottom: 0 !important;
            z-index: 40 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.2s ease !important;
          }
          .ops-sidebar-open { transform: translateX(0) !important; }
          .ops-overlay { display: block !important; }
        }
      `}</style>
    </div>
  )
}
