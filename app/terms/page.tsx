import SiteLayout from '../components/SiteLayout'

export const metadata = {
  title: 'Terms of Service | Shirey Enterprise Group',
}

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
        <span className="font-semibold" style={{ color: '#E8E0D0' }}>STOP</span> to any message. A single
        confirmation message will be sent and no further messages will follow. To re-enroll, complete the opt-in
        form again at shireyegroup.com/sms-opt-in.
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
        <a
          href="mailto:gshirey@gmail.com"
          className="underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: '#C4891A' }}
        >
          gshirey@gmail.com
        </a>
      </>
    ),
  },
]

export default function Terms() {
  return (
    <SiteLayout>
    <main className="px-4 py-16">
      <div className="mx-auto w-full max-w-2xl">

        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: '#E8E0D0' }}>
            Terms of Service
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

      </div>
    </main>
    </SiteLayout>
  )
}
