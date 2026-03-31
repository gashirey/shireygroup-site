import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('seg_deployment_events')
    .select('*')
    .order('created_on', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createAdminClient()

  const fields = {
    event_name: body.event_name,
    storm_name: body.storm_name || null,
    event_type: body.event_type || 'reactive',
    pu_client: body.pu_client || null,
    affected_states: body.affected_states || null,
    warning_order_date: body.warning_order_date || null,
    mobilization_date: body.mobilization_date || null,
    estimated_crew_count: body.estimated_crew_count ? Number(body.estimated_crew_count) : null,
    status: body.status || 'warning',
    notes: body.notes || null,
    updated_on: new Date().toISOString(),
  }

  if (body.id) {
    const { data, error } = await supabase
      .from('seg_deployment_events')
      .update(fields)
      .eq('id', body.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } else {
    const { data, error } = await supabase
      .from('seg_deployment_events')
      .insert(fields)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }
}
