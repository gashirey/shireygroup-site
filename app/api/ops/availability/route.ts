import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const event_id = searchParams.get('event_id')

  if (!event_id) return NextResponse.json({ error: 'event_id is required' }, { status: 400 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('seg_availability')
    .select(`
      *,
      contractor:seg_contractors (
        id, badge, last_name, first_name, grade, subnetwork,
        home_state, power_hours, phone, current_city, current_state
      )
    `)
    .eq('event_id', event_id)
    .order('created_on', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createAdminClient()

  // Bulk upsert all contractors into an event
  if (body.bulk_add_all && body.event_id) {
    const { data: contractors, error: cErr } = await supabase
      .from('seg_contractors')
      .select('id')
      .eq('active', true)

    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 })

    const rows = contractors.map((c: { id: number }) => ({
      event_id: body.event_id,
      contractor_id: c.id,
    }))

    const { error } = await supabase
      .from('seg_availability')
      .upsert(rows, { onConflict: 'event_id,contractor_id', ignoreDuplicates: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, count: rows.length })
  }

  // Bulk mark SMS sent
  if (body.bulk_sms_sent && body.event_id && Array.isArray(body.contractor_ids)) {
    const { error } = await supabase
      .from('seg_availability')
      .update({ sms_sent: true, sms_sent_at: new Date().toISOString(), updated_on: new Date().toISOString() })
      .eq('event_id', body.event_id)
      .in('contractor_id', body.contractor_ids)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Single row upsert
  const { event_id, contractor_id, ...fields } = body
  if (!event_id || !contractor_id) {
    return NextResponse.json({ error: 'event_id and contractor_id are required' }, { status: 400 })
  }

  const upsertData: Record<string, unknown> = {
    event_id,
    contractor_id,
    updated_on: new Date().toISOString(),
  }

  const allowed = ['response', 'response_method', 'sms_sent', 'sms_sent_at', 'rank_wave', 'hot_status', 'deployed', 'slotted', 'notes', 'current_city', 'current_state']
  allowed.forEach(k => { if (k in fields) upsertData[k] = fields[k] })
  if (fields.response) upsertData.response_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('seg_availability')
    .upsert(upsertData, { onConflict: 'event_id,contractor_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
