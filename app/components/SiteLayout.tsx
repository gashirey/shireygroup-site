import Image from 'next/image'
import Link from 'next/link'
import HamburgerMenu from './HamburgerMenu'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Header */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E5E7EB' }}>
        <div
          style={{
            maxWidth: '768px',
            margin: '0 auto',
            padding: '0 24px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Image
              src="/seg_logo_color_full.png"
              alt="Shirey Enterprise Group"
              width={90}
              height={30}
              style={{ maxHeight: '30px', width: 'auto', objectFit: 'contain' }}
            />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#0D1B2A',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Shirey Enterprise Group
            </span>
          </Link>

          <HamburgerMenu />
        </div>
      </header>

      {/* Page content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #E5E7EB' }}>
        <div
          style={{
            maxWidth: '768px',
            margin: '0 auto',
            padding: '20px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            &copy; 2026 Shirey Enterprise Group
          </p>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
              { href: '/sms-policy', label: 'SMS Policy' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: '12px', color: '#6B7280', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}
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
