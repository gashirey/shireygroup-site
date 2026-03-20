import Image from 'next/image'
import Link from 'next/link'
import SiteLayout from './components/SiteLayout'

const dm = { fontFamily: "'DM Sans', sans-serif" }
const bc = { fontFamily: "'Barlow Condensed', sans-serif" }

const cards = [
  {
    heading: 'Who We Are',
    body: "SEG is one of a select group of labor partners to Recovery Logistics (RLI), one of the nation's leading storm deployment and utility base camp operators. When severe weather events knock out power, RLI coordinates the response — drawing on its network of partner companies, including SEG, to field the contractors who do the work on the ground.",
    cta: null,
  },
  {
    heading: 'The Work',
    body: 'On the ground, our contractors run the infrastructure that keeps utility crews moving — camp management, check-in and credentialing, logistics and admin support, food service, and facilities operations. The work is demanding and the hours are long. All contractors are independent 1099 workers — you decide which opportunities to accept.',
    cta: null,
  },
  {
    heading: 'Stay Ready',
    body: 'SMS alerts go out when deployment windows open, when standby is called, and when events stand down. We also check in periodically throughout the year to keep our team current — even when things are quiet. No marketing. No noise. Just the information you need, when you need it.',
    cta: { label: 'Sign up for alerts →', href: '/sms-opt-in' },
  },
]

export default function Home() {
  return (
    <SiteLayout>
      {/* Centered page column — max 768px, gutters on both sides */}
      <main
        style={{
          maxWidth: '768px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >

        {/* Hero */}
        <section
          style={{ backgroundColor: '#F7F7F5', padding: '20px 32px 32px', textAlign: 'center' }}
        >
          <Image
            src="/seg_logo_color_full.png"
            alt="Shirey Enterprise Group"
            width={400}
            height={130}
            style={{ maxHeight: '130px', width: 'auto', display: 'block', margin: '0 auto 32px' }}
            priority
          />
          <h1
            style={{
              color: '#0D1B2A',
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: '20px',
              ...bc,
            }}
          >
            Hard work. Meaningful work. Paid work.
          </h1>
          <p
            style={{
              color: '#6B7280',
              fontSize: '18px',
              lineHeight: 1.6,
              maxWidth: '540px',
              margin: '0 auto 32px',
              ...dm,
            }}
          >
            Shirey Enterprise Group fields independent contractors into storm response and utility
            base camp deployments across the United States.
          </p>
          <Link
            href="/sms-opt-in"
            style={{
              display: 'inline-block',
              backgroundColor: '#C4891A',
              color: '#0D1B2A',
              padding: '12px 32px',
              borderRadius: '6px',
              fontWeight: 500,
              textDecoration: 'none',
              ...dm,
            }}
          >
            Sign Up for SMS Alerts
          </Link>
        </section>

        {/* Cards */}
        <section style={{ backgroundColor: '#F7F7F5', padding: '16px 32px 48px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '24px',
            }}
          >
            {cards.map(({ heading, body, cta }) => (
              <div
                key={heading}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  borderTop: '3px solid #C4891A',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <h2
                  style={{
                    color: '#0D1B2A',
                    fontSize: '20px',
                    fontWeight: 700,
                    marginBottom: '12px',
                    ...bc,
                  }}
                >
                  {heading}
                </h2>
                <p
                  style={{
                    color: '#6B7280',
                    fontSize: '14px',
                    lineHeight: 1.65,
                    flex: 1,
                    margin: 0,
                    ...dm,
                  }}
                >
                  {body}
                </p>
                {cta && (
                  <Link
                    href={cta.href}
                    style={{
                      display: 'inline-block',
                      marginTop: '16px',
                      color: '#C4891A',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      ...dm,
                    }}
                  >
                    {cta.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>
    </SiteLayout>
  )
}
