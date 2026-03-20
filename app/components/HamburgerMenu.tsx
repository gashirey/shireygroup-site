'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const dm = { fontFamily: "'DM Sans', sans-serif" }

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/sms-opt-in', label: 'SMS Alerts' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/sms-policy', label: 'SMS Policy' },
]

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '5px',
          width: '36px',
          height: '36px',
          padding: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        <span
          style={{
            display: 'block',
            height: '2px',
            backgroundColor: '#0D1B2A',
            borderRadius: '2px',
            transition: 'transform 0.2s, opacity 0.2s',
            transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
          }}
        />
        <span
          style={{
            display: 'block',
            height: '2px',
            backgroundColor: '#0D1B2A',
            borderRadius: '2px',
            transition: 'opacity 0.2s',
            opacity: open ? 0 : 1,
          }}
        />
        <span
          style={{
            display: 'block',
            height: '2px',
            backgroundColor: '#0D1B2A',
            borderRadius: '2px',
            transition: 'transform 0.2s, opacity 0.2s',
            transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <nav
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            minWidth: '200px',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '12px 20px',
                color: '#0D1B2A',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                borderBottom: '1px solid #F3F4F6',
                ...dm,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F7F5'
                ;(e.currentTarget as HTMLElement).style.color = '#C4891A'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLElement).style.color = '#0D1B2A'
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
