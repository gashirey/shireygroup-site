import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(req) {
  const formData = await req.formData()
  const phone = formData.get('From')
  const message = formData.get('Body')

  const phoneStr = phone != null ? String(phone) : ''
  const messageStr = message != null ? String(message) : ''

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('sms_replies').insert({
      phone: phoneStr,
      message: messageStr,
      received_at: new Date().toISOString(),
    })
    if (error) {
      console.error('sms_replies insert failed:', error)
    }
  } catch (err) {
    console.error('sms_replies insert failed:', err)
  }

  return new Response('<Response></Response>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
