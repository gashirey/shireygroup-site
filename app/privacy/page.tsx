import Image from 'next/image'

export const metadata = {
  title: 'Privacy Policy | Shirey Enterprise Group',
}

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
        <span className="font-semibold" style={{ color: '#E8E0D0' }}>STOP</span> to any message. To request deletion
        of your personal data, contact us at{' '}
        <a
          href="mailto:george@shireyegroup.com"
          className="underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: '#C4891A' }}
        >
          george@shireyegroup.com
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
        <a
          href="mailto:george@shireyegroup.com"
          className="underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: '#C4891A' }}
        >
          george@shireyegroup.com
        </a>
      </>
    ),
  },
]

export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="text-xs mt-2" style={{ color: '#7A6E62' }}>
            Shirey Enterprise Group &nbsp;·&nbsp; Effective March 2026
          </p>
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
        <div className="text-center text-xs">
          <a href="/sms-policy" className="hover:underline transition-colors" style={{ color: '#7A6E62' }}>
            SMS Policy
          </a>
        </div>

      </div>
    </main>
  )
}
