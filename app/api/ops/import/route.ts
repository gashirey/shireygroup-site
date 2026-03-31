import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/^"|"$/g, ''))

  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = parseCSVLine(line)
      const row: Record<string, string> = {}
      headers.forEach((header, i) => { row[header] = (values[i] ?? '').replace(/^"|"$/g, '') })
      return row
    })
    .filter(row => Object.values(row).some(v => v))
}

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Expected multipart form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const text = await file.text()
  const rows = parseCSV(text)

  if (rows.length === 0) {
    return NextResponse.json({ error: 'CSV is empty or has no data rows' }, { status: 400 })
  }

  const supabase = createAdminClient()
  let rows_imported = 0
  let rows_updated = 0
  let rows_skipped = 0

  for (const row of rows) {
    const badge = row['badge']?.trim()
    if (!badge) { rows_skipped++; continue }

    // Parse name: "Last, First" format
    const nameRaw = row['name'] ?? ''
    let last_name = ''
    let first_name = ''
    if (nameRaw.includes(',')) {
      const parts = nameRaw.split(',')
      last_name = parts[0].trim()
      first_name = parts.slice(1).join(',').trim()
    } else if (nameRaw.trim()) {
      const parts = nameRaw.trim().split(' ')
      last_name = parts[parts.length - 1]
      first_name = parts.slice(0, -1).join(' ')
    }

    const grade = row['grade']?.trim() || 'New'
    const subnetwork = row['subnetwork']?.trim() || null
    const total_hours = parseInt(row['total hours'] ?? '0') || 0
    const telecom_hours = parseInt(row['telecom hours'] ?? '0') || 0
    const power_hours = parseInt(row['power hours'] ?? '0') || 0
    const confirmed = row['contractor confirmed']?.trim()
    const last_confirmed_at = confirmed ? new Date().toISOString() : null

    const upsertData: Record<string, unknown> = {
      badge,
      grade: ['A', 'B', 'C', 'New'].includes(grade) ? grade : 'New',
      subnetwork,
      total_hours,
      telecom_hours,
      power_hours,
      updated_on: new Date().toISOString(),
    }

    if (last_name) upsertData.last_name = last_name
    if (first_name) upsertData.first_name = first_name
    if (last_confirmed_at) upsertData.last_confirmed_at = last_confirmed_at

    // Check if badge exists
    const { data: existing } = await supabase
      .from('seg_contractors')
      .select('id')
      .eq('badge', badge)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('seg_contractors')
        .update(upsertData)
        .eq('badge', badge)
      if (error) { rows_skipped++; continue }
      rows_updated++
    } else {
      const { error } = await supabase
        .from('seg_contractors')
        .insert({
          ...upsertData,
          last_name: last_name || '(unknown)',
          first_name: first_name || '',
        })
      if (error) { rows_skipped++; continue }
      rows_imported++
    }
  }

  // Log the import
  await supabase.from('seg_import_log').insert({
    filename: file.name,
    rows_imported,
    rows_updated,
    rows_skipped,
    imported_by: user.email ?? 'unknown',
  })

  return NextResponse.json({ rows_imported, rows_updated, rows_skipped, filename: file.name })
}
