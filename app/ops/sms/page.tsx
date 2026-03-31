import { createSupabaseServerClient } from '@/lib/supabase-server'

type SmsOptIn = {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  sms_status: string | null
  created_at: string
}

type SmsReply = {
  id: string
  phone: string
  message: string
  received_at: string
}

function normalizePhoneDigits(value: string) {
  let d = value.replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1)
  return d
}

function signupDisplayName(row: SmsOptIn) {
  return [row.first_name, row.last_name].filter(Boolean).join(' ').trim()
}

function formatWhen(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default async function OpsSmsPage() {
  const supabase = await createSupabaseServerClient()

  const [signupsResult, repliesResult] = await Promise.all([
    supabase
      .from('sms_opt_ins')
      .select('id, first_name, last_name, phone, sms_status, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('sms_replies')
      .select('id, phone, message, received_at')
      .order('received_at', { ascending: false }),
  ])

  const signups = (signupsResult.data ?? []) as SmsOptIn[]
  const replies = (repliesResult.data ?? []) as SmsReply[]

  const phoneDigitsToName = new Map<string, string>()
  for (const s of signups) {
    const name = signupDisplayName(s)
    if (!name || !s.phone) continue
    phoneDigitsToName.set(normalizePhoneDigits(s.phone), name)
  }

  function replyContactLabel(replyPhone: string) {
    const key = normalizePhoneDigits(replyPhone)
    if (key && phoneDigitsToName.has(key)) {
      return phoneDigitsToName.get(key)!
    }
    return replyPhone
  }

  const signupsError = signupsResult.error
  const repliesError = repliesResult.error

  return (
    <div className="max-w-6xl">
      <h1
        className="mb-8 text-2xl font-bold tracking-wide text-[#0D1B2A]"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        SMS
      </h1>

      <section className="mb-12">
        <h2
          className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#6B7280]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Signups
        </h2>
        <div className="overflow-hidden rounded-lg border border-[#E5E7EB] border-t-[3px] border-t-[#C4891A] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
          {signupsError ? (
            <p className="px-4 py-10 text-center text-sm text-red-700">
              Could not load signups.
            </p>
          ) : signups.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-[#6B7280]">No signups yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F7F7F5]">
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      Name
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      Phone
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      SMS status
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      Signed up
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {signups.map((row, i) => (
                    <tr
                      key={row.id}
                      className={
                        i < signups.length - 1 ? 'border-b border-[#F3F4F6]' : ''
                      }
                    >
                      <td className="px-4 py-3 font-semibold text-[#0D1B2A]">
                        {signupDisplayName(row) || '—'}
                      </td>
                      <td className="px-4 py-3 text-[#374151]">{row.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-[#374151]">
                        {row.sms_status ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[#374151]">
                        {formatWhen(row.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2
          className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#6B7280]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Replies
        </h2>
        <div className="overflow-hidden rounded-lg border border-[#E5E7EB] border-t-[3px] border-t-[#C4891A] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
          {repliesError ? (
            <p className="px-4 py-10 text-center text-sm text-red-700">
              Could not load replies.
            </p>
          ) : replies.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-[#6B7280]">No replies yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F7F7F5]">
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      Phone
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      Message
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      Received
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {replies.map((row, i) => (
                    <tr
                      key={row.id}
                      className={
                        i < replies.length - 1 ? 'border-b border-[#F3F4F6]' : ''
                      }
                    >
                      <td className="max-w-[200px] px-4 py-3 align-top font-medium text-[#0D1B2A]">
                        {replyContactLabel(row.phone)}
                      </td>
                      <td className="px-4 py-3 align-top break-words text-[#374151]">
                        {row.message}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top text-[#374151]">
                        {formatWhen(row.received_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
