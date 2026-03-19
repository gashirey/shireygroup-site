import { supabase } from '@/lib/supabase'

export async function POST(req) {
  const { first_name, last_name, phone } = await req.json()

  if (!phone) {
    return Response.json({ error: 'Phone is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('sms_opt_ins')
    .insert([{
      first_name,
      last_name,
      phone,
      consent: true,
      consent_text: 'I agree to receive SMS messages from Shirey Enterprise Group (SEG). Reply STOP to unsubscribe. Msg & data rates may apply.',
      source: 'website'
    }])

  if (error) return Response.json({ error }, { status: 500 })

  return Response.json({ success: true })
}