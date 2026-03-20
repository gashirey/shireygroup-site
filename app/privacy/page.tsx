import SiteLayout from '../components/SiteLayout'

export const metadata = {
  title: 'Privacy Policy | Shirey Enterprise Group',
}

const dm = { fontFamily: "'DM Sans', sans-serif" }
const bc = { fontFamily: "'Barlow Condensed', sans-serif" }

const sections = [
  {
    heading: 'Information We Collect',
    body: 'When you submit the SMS opt-in form, we collect your first name, last name, and mobile phone number. We also collect technical information automatically, including your IP address and basic browser and device information, for security and compliance purposes.',
  },
  {
    heading: 'How We Use It',
    body: 'Information you provide is used solely to send SMS deployment alerts, standby notices, and operational updates to opted-in contractors. We do not sell, rent, or share your personal data with third parties for marketing purposes. We share data only as necessary to deliver the SMS service — including with Twilio, our SMS delivery provider — and as required by law.',
  },
  {
    heading: 'Data Storage',
    body: 'All data is stored securely using industry-standard practices. Opt-in records, including consent timestamps and phone numbers, are retained for compliance and audit purposes in accordance with applicable telecommunications regulations.',
  },
  {
    heading: 'Your Rights',
    body: (
      <>
        You may opt out of SMS messages at any time by replying{' '}
        <strong style={{ color: '#0D1B2A', fontWeight: 600 }}>STOP</strong> to any message. To request deletion
        of your personal data, contact us at{' '}
        <a href="mailto:gshirey@gmail.com" style={{ color: '#C4891A', textDecoration: 'underline' }}>
          gshirey@gmail.com
        </a>
        . We will respond to verified deletion requests within a reasonable timeframe.
      </>
    ),
  },
  {
    heading: 'Contact',
    body: (
      <>
        Shirey Enterprise Group (SEG)
        <br />
        <a href="mailto:gshirey@gmail.com" style={{ color: '#C4891A', textDecoration: 'underline' }}>
          gshirey@gmail.com
        </a>
      </>
    ),
  },
]

export default function Privacy() {
  return (
    <SiteLayout>
      <main style={{ maxWidth: '768px', margin: '0 auto', width: '100%', padding: '48px 32px', boxSizing: 'border-box' }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #E5E7EB',
          borderTop: '3px solid #C4891A',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          overflow: 'hidden',
        }}>

          {/* Header zone */}
          <div style={{ padding: '28px 36px 24px', borderBottom: '1px solid #F3F4F6', backgroundColor: '#FAFAFA' }}>
            <h1 style={{ color: '#0D1B2A', fontSize: '28px', fontWeight: 700, lineHeight: 1.15, marginBottom: '6px', ...bc }}>
              Privacy Policy
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0, ...dm }}>
              Shirey Enterprise Group &nbsp;·&nbsp; Effective March 2026
            </p>
          </div>

          {/* Content zone */}
          <div style={{ padding: '28px 36px 36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {sections.map(({ heading, body }, i) => (
              <section key={i}>
                <h2 style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: '#C4891A',
                  marginBottom: '6px',
                  ...dm,
                }}>
                  {heading}
                </h2>
                <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#6B7280', margin: 0, ...dm }}>
                  {body}
                </p>
              </section>
            ))}
          </div>

        </div>
      </main>
    </SiteLayout>
  )
}
