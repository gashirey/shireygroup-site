import { supabase } from '@/lib/supabase'
import twilio from 'twilio'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

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

  let sms_status = 'failed'
  try {
    await twilioClient.messages.create({
      body: `Hi ${first_name || 'there'} — you're in the SEG network. We'll reach you here for deployment updates and check-ins. Reply anytime and our team will see it. — Shirey Enterprise Group`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
    sms_status = 'sent'
  } catch (err) {
    console.error('Twilio welcome SMS failed:', err)
    sms_status = 'failed'
  }

  const { error: updateError } = await supabase
    .from('sms_opt_ins')
    .update({ sms_status })
    .eq('phone', phone)

  if (updateError) {
    console.error('Failed to persist sms_status:', updateError)
  }

  return Response.json({ success: true, sms_status })
}