import Image from 'next/image'

export const metadata = {
  title: 'SMS Communications Policy | Shirey Enterprise Group',
}

const sections = [
  {
    heading: 'Program Description',
    body: 'Shirey Enterprise Group (SEG) sends SMS messages exclusively to independent contractors who have voluntarily opted in to receive deployment alerts, standby notices, and operational updates. Messages relate to storm response and utility base camp events operated through our partner Recovery Logistics (RLI). You will never receive marketing or promotional messages through this program.',
  },
  {
    heading: 'Message Frequency',
    body: 'Message frequency varies based on active field events. During inactive periods you may receive no messages for weeks at a time. During active deployment events you may receive multiple messages in a single day. All messages are operationally relevant — standby notices, mobilization alerts, or stand-down confirmations.',
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
        Reply <span style={{ color: '#E8E0D0' }} className="font-semibold">HELP</span> to any message for assistance.
        You may also contact us directly at{' '}
        <a
          href="mailto:george@shireyegroup.com"
          className="underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: '#C4891A' }}
        >
          george@shireyegroup.com
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
    <main className="min-h-screen px-4 py-16" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="mx-auto w-full max-w-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/seg_logo_color_full.png"
            alt="Shirey Enterprise Group"
            width={200}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: '#E8E0D0' }}>
            SMS Communications Policy
          </h1>
          <div className="mt-3 h-px w-16" style={{ backgroundColor: '#C4891A' }} />
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          {sections.map(({ heading, body }, i) => (
            <section key={i}>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#C4891A' }}>
                {heading}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#A89880' }}>
                {body}
              </p>
            </section>
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 h-px" style={{ backgroundColor: 'rgba(196,137,26,0.2)' }} />

        {/* Footer */}
        <div className="text-center text-xs" style={{ color: '#4A4035' }}>
          <a href="/sms-opt-in" className="hover:underline transition-colors" style={{ color: '#7A6E62' }}>
            SMS Opt-In
          </a>
          <span className="mx-2">·</span>
          <a href="/privacy" className="hover:underline transition-colors" style={{ color: '#7A6E62' }}>
            Privacy Policy
          </a>
        </div>

      </div>
    </main>
  )
}
