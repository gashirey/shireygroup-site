import SiteLayout from '../components/SiteLayout'

export const metadata = {
  title: 'Terms of Service | Shirey Enterprise Group',
}

const dm = { fontFamily: "'DM Sans', sans-serif" }
const bc = { fontFamily: "'Barlow Condensed', sans-serif" }

const sections = [
  {
    heading: 'Agreement',
    body: 'By opting in to receive SMS alerts from Shirey Enterprise Group (SEG), you agree to these Terms of Service. If you do not agree, do not submit the opt-in form.',
  },
  {
    heading: 'Service Description',
    body: 'SEG provides SMS notifications to independent contractors regarding storm response and utility base camp deployment opportunities operated through our partner Recovery Logistics (RLI). This is an operational communication service. It is not a marketing service, and you will not receive promotional messages.',
  },
  {
    heading: 'Eligibility',
    body: 'You must be at least 18 years of age and a current or prospective SEG independent contractor to enroll in SMS alerts. By submitting the opt-in form you represent that you meet these requirements.',
  },
  {
    heading: 'Opt-Out',
    body: (
      <>
        You may opt out at any time by replying{' '}
        <strong style={{ color: '#0D1B2A', fontWeight: 600 }}>STOP</strong> to any message. A single confirmation
        message will be sent and no further messages will follow. To re-enroll, complete the opt-in form again at
        shireyegroup.com/sms-opt-in.
      </>
    ),
  },
  {
    heading: 'Limitation of Liability',
    body: 'SEG is not liable for missed, delayed, or undelivered messages due to carrier issues or technical failures. SEG is not liable for deployment decisions made — or not made — based on SMS communications. All deployment opportunities communicated via SMS are subject to change without notice.',
  },
  {
    heading: 'Changes to These Terms',
    body: 'SEG may update these Terms of Service at any time. The effective date at the top of this page reflects the most recent revision. Continued enrollment in SMS alerts following any update constitutes your acceptance of the revised terms.',
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

export default function Terms() {
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
              Terms of Service
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
