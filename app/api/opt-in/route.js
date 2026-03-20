import { supabase } from '@/lib/supabase'

export async function POST(req) {
  const { first_name, last_name, phone, user_agent } = await req.json()

  if (!phone) {
    return Response.json({ error: 'Phone is required' }, { status: 400 })
  }

  const ip_address =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null

  const { error } = await supabase
    .from('sms_opt_ins')
    .insert([{
      first_name,
      last_name,
      phone,
      consent: true,
      consent_text: 'I agree to receive SMS messages from Shirey Enterprise Group (SEG) regarding deployment opportunities, operational updates, and periodic roster check-ins. Reply STOP to unsubscribe. Reply HELP for help. Msg & data rates may apply.',
      source: 'website',
      user_agent: user_agent ?? null,
      ip_address,
    }])

  if (error) return Response.json({ error }, { status: 500 })

  return Response.json({ success: true })
}