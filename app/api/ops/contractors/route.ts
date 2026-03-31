import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.trim() ?? ''
  const grade = searchParams.get('grade')?.trim() ?? ''

  const supabase = createAdminClient()
  let query = supabase
    .from('seg_contractors')
    .select('id, badge, last_name, first_name, grade, subnetwork, home_state, power_hours, telecom_hours, total_hours, phone, email, active, current_city, current_state, mileage, bau, last_confirmed_at')
    .order('last_name', { ascending: true })

  if (grade) query = query.eq('grade', grade)

  if (search) {
    query = query.or(`badge.ilike.%${search}%,last_name.ilike.%${search}%,first_name.ilike.%${search}%,subnetwork.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
