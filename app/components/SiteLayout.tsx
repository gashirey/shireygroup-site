'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#0D1B2A' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(196,137,26,0.15)' }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/seg_logo_color_full.png"
              alt="Shirey Enterprise Group"
              width={120}
              height={40}
              className="object-contain"
              style={{ maxHeight: '40px', width: 'auto' }}
            />
            <span className="text-sm font-semibold hidden sm:block" style={{ color: '#E8E0D0' }}>
              Shirey Enterprise Group
            </span>
          </Link>

          <nav>
            <Link
              href="/sms-opt-in"
              className="text-sm font-medium transition-colors"
              style={{ color: '#A89880' }}
              onMouseOver={e => ((e.target as HTMLElement).style.color = '#C4891A')}
              onMouseOut={e => ((e.target as HTMLElement).style.color = '#A89880')}
            >
              SMS Alerts
            </Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(196,137,26,0.15)' }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: '#4A4035' }}>
            &copy; 2026 Shirey Enterprise Group
          </p>
          <nav className="flex items-center gap-5 text-xs">
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
              { href: '/sms-policy', label: 'SMS Policy' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:underline"
                style={{ color: '#7A6E62' }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>

    </div>
  )
}
