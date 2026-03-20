import SiteLayout from '../components/SiteLayout'

export const metadata = {
  title: 'SMS Communications Policy | Shirey Enterprise Group',
}

const dm = { fontFamily: "'DM Sans', sans-serif" }
const bc = { fontFamily: "'Barlow Condensed', sans-serif" }

const sections = [
  {
    heading: 'Program Description',
    body: 'Shirey Enterprise Group (SEG) sends SMS messages exclusively to independent contractors who have voluntarily opted in to receive deployment alerts, standby notices, and operational updates. Messages relate to storm response and utility base camp events operated through our partner Recovery Logistics (RLI). You will never receive marketing or promotional messages through this program.',
  },
  {
    heading: 'Message Frequency',
    body: 'Message frequency varies based on active field events. During inactive periods you may receive no messages for weeks at a time. During active deployment events you may receive multiple messages in a single day. All messages are operationally relevant — standby notices, mobilization alerts, stand-down confirmations, or periodic roster check-ins.',
  },
  {
    heading: 'How to Opt In',
    body: 'Complete the opt-in form at shireyegroup.com/sms-opt-in. You must check the consent checkbox to enroll — it is never pre-checked. By submitting the form you acknowledge and agree to this policy.',
  },
  {
    heading: 'How to Opt Out',
    body: 'Reply STOP to any message at any time to unsubscribe. You will receive one confirmation message and no further messages will be sent to your number. To re-enroll, complete the opt-in form again.',
  },
  {
    heading: 'Help',
    body: (
      <>
        Reply <strong style={{ color: '#0D1B2A', fontWeight: 600 }}>HELP</strong> to any message for assistance.
        You may also contact us directly at{' '}
        <a href="mailto:gshirey@gmail.com" style={{ color: '#C4891A', textDecoration: 'underline' }}>
          gshirey@gmail.com
        </a>
        .
      </>
    ),
  },
  {
    heading: 'Cost',
    body: 'Standard message and data rates may apply depending on your mobile carrier plan. SEG does not charge any additional fee to receive SMS alerts.',
  },
  {
    heading: 'Supported Carriers',
    body: 'All major U.S. carriers are supported, including AT&T, Verizon, T-Mobile, Sprint, and regional carriers. Carriers are not liable for delayed or undelivered messages. Delivery is subject to carrier network availability.',
  },
]

export default function SmsPolicy() {
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
            <h1 style={{ color: '#0D1B2A', fontSize: '28px', fontWeight: 700, lineHeight: 1.15, margin: 0, ...bc }}>
              SMS Communications Policy
            </h1>
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
