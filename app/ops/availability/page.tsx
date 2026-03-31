'use client'

import { useEffect, useState, useCallback } from 'react'

type Response = 'YES' | 'NO' | 'NO_RESPONSE'

interface AvailabilityRow {
  id: number
  event_id: number
  contractor_id: number
  response: Response
  sms_sent: boolean
  sms_sent_at: string | null
  response_method: string
  deployed: boolean
  rank_wave: number | null
  hot_status: string
  notes: string | null
  contractor: {
    id: number
    badge: string
    last_name: string
    first_name: string
    grade: string
    subnetwork: string | null
    home_state: string | null
    power_hours: number
    phone: string | null
  }
}

interface DeploymentEvent {
  id: number
  event_name: string
  status: string
}

const RESPONSE_STYLES: Record<Response, { bg: string; color: string; label: string }> = {
  YES:         { bg: '#DCFCE7', color: '#166534', label: 'YES' },
  NO:          { bg: '#FEE2E2', color: '#991B1B', label: 'NO' },
  NO_RESPONSE: { bg: '#F3F4F6', color: '#6B7280', label: '—' },
}

const RESPONSE_CYCLE: Response[] = ['YES', 'NO', 'NO_RESPONSE']

export default function AvailabilityPage() {
  const [events, setEvents] = useState<DeploymentEvent[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [rows, setRows] = useState<AvailabilityRow[]>([])
  const [loading, setLoading] = useState(false)
  const [filterGrade, setFilterGrade] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterMinPower, setFilterMinPower] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState<Record<number, boolean>>({})

  useEffect(() => {
    fetch('/api/ops/events')
      .then(r => r.json())
      .then(d => {
        const evts = Array.isArray(d) ? d : []
        setEvents(evts)
        const active = evts.find((e: DeploymentEvent) => e.status === 'active') ?? evts[0]
        if (active) setSelectedEventId(String(active.id))
      })
  }, [])

  const fetchRows = useCallback(async (eventId: string) => {
    if (!eventId) return
    setLoading(true)
    const res = await fetch(`/api/ops/availability?event_id=${eventId}`)
    const d = await res.json()
    setRows(Array.isArray(d) ? d : [])
    setSelected(new Set())
    setLoading(false)
  }, [])

  useEffect(() => { if (selectedEventId) fetchRows(selectedEventId) }, [selectedEventId, fetchRows])

  async function updateResponse(row: AvailabilityRow, newResponse: Response) {
    setSaving(s => ({ ...s, [row.id]: true }))
    await fetch('/api/ops/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: row.event_id,
        contractor_id: row.contractor_id,
        response: newResponse,
        response_method: 'manual',
      }),
    })
    setRows(rs => rs.map(r => r.id === row.id ? { ...r, response: newResponse } : r))
    setSaving(s => ({ ...s, [row.id]: false }))
  }

  function cycleResponse(row: AvailabilityRow) {
    const idx = RESPONSE_CYCLE.indexOf(row.response)
    const next = RESPONSE_CYCLE[(idx + 1) % RESPONSE_CYCLE.length]
    updateResponse(row, next)
  }

  async function handleBulkSmsSent() {
    if (selected.size === 0) return
    const contractorIds = rows.filter(r => selected.has(r.contractor_id)).map(r => r.contractor_id)
    await fetch('/api/ops/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bulk_sms_sent: true, event_id: Number(selectedEventId), contractor_ids: contractorIds }),
    })
    fetchRows(selectedEventId)
    setSelected(new Set())
  }

  async function handleAddAll() {
    await fetch('/api/ops/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bulk_add_all: true, event_id: Number(selectedEventId) }),
    })
    fetchRows(selectedEventId)
  }

  function toggleSelect(contractorId: number) {
    setSelected(s => {
      const n = new Set(s)
      if (n.has(contractorId)) n.delete(contractorId)
      else n.add(contractorId)
      return n
    })
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(r => r.contractor_id)))
  }

  const filtered = rows.filter(r => {
    if (filterGrade && r.contractor.grade !== filterGrade) return false
    if (filterState && r.contractor.home_state !== filterState.toUpperCase()) return false
    if (filterMinPower && r.contractor.power_hours < Number(filterMinPower)) return false
    return true
  })

  const allSelected = filtered.length > 0 && selected.size === filtered.length

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={pageTitle}>AVAILABILITY</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {selected.size > 0 && (
            <button onClick={handleBulkSmsSent} style={btnGhost}>
              Mark SMS Sent ({selected.size})
            </button>
          )}
          <button onClick={handleAddAll} disabled={!selectedEventId} style={btnAmber}>
            + Add All Contractors
          </button>
        </div>
      </div>

      {/* Event selector + filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} style={{ ...inputStyle, minWidth: '220px' }}>
          <option value="">Select an event…</option>
          {events.map(e => <option key={e.id} value={String(e.id)}>{e.event_name}</option>)}
        </select>
        <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} style={{ ...inputStyle, width: '130px' }}>
          <option value="">All Grades</option>
          {['A', 'B', 'C', 'New'].map(g => <option key={g} value={g}>Grade {g}</option>)}
        </select>
        <input type="text" placeholder="State (e.g. NC)" value={filterState} onChange={e => setFilterState(e.target.value)} style={{ ...inputStyle, width: '110px' }} maxLength={2} />
        <input type="number" placeholder="Min power hrs" value={filterMinPower} onChange={e => setFilterMinPower(e.target.value)} style={{ ...inputStyle, width: '130px' }} />
      </div>

      <div style={card}>
        {!selectedEventId ? (
          <div style={emptyState}>Select an event above to view availability.</div>
        ) : loading ? (
          <div style={emptyState}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={emptyState}>No contractors in this event. Use "+ Add All Contractors" to populate.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ ...thStyle, width: '36px' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} style={{ cursor: 'pointer' }} />
                </th>
                {['Badge', 'Name', 'Grade', 'Subnetwork', 'State', 'Power Hrs', 'Phone', 'Response', 'SMS Sent', 'Method'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const rs = RESPONSE_STYLES[row.response] ?? RESPONSE_STYLES.NO_RESPONSE
                const c = row.contractor
                return (
                  <tr key={row.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none', opacity: saving[row.id] ? 0.6 : 1 }}>
                    <td style={{ ...tdStyle, paddingRight: 0 }}>
                      <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, fontFamily: 'monospace', color: '#0D1B2A' }}>{c.badge}</td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{c.last_name}, {c.first_name}</td>
                    <td style={tdStyle}>
                      <span style={{ ...gradeBadge, ...gradeColors[c.grade] }}>{c.grade}</span>
                    </td>
                    <td style={{ ...tdStyle, color: '#6B7280' }}>{c.subnetwork || '—'}</td>
                    <td style={tdStyle}>{c.home_state || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{c.power_hours.toLocaleString()}</td>
                    <td style={{ ...tdStyle, color: '#6B7280' }}>{c.phone || '—'}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => cycleResponse(row)}
                        disabled={saving[row.id]}
                        style={{ backgroundColor: rs.bg, color: rs.color, border: 'none', borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", minWidth: '60px' }}
                      >
                        {rs.label}
                      </button>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {row.sms_sent ? <span style={{ color: '#166534', fontSize: '12px' }}>✓</span> : <span style={{ color: '#D1D5DB' }}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, color: '#9CA3AF', fontSize: '12px', textTransform: 'capitalize' }}>{row.response_method}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && selectedEventId && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#9CA3AF' }}>
          {filtered.length} contractor{filtered.length !== 1 ? 's' : ''} · {rows.filter(r => r.response === 'YES').length} YES · {rows.filter(r => r.response === 'NO').length} NO · {rows.filter(r => r.response === 'NO_RESPONSE').length} no response
        </div>
      )}
    </div>
  )
}

const gradeColors: Record<string, React.CSSProperties> = {
  A:   { backgroundColor: '#DCFCE7', color: '#166534' },
  B:   { backgroundColor: '#DBEAFE', color: '#1E40AF' },
  C:   { backgroundColor: '#FEF9C3', color: '#854D0E' },
  New: { backgroundColor: '#F3F4F6', color: '#4B5563' },
}

const pageTitle: React.CSSProperties = { margin: 0, fontSize: '24px', fontWeight: 700, color: '#0D1B2A', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }
const card: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden', borderTop: '3px solid #C4891A' }
const emptyState: React.CSSProperties = { padding: '48px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }
const thStyle: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }
const tdStyle: React.CSSProperties = { padding: '10px 14px', color: '#374151', verticalAlign: 'middle' }
const gradeBadge: React.CSSProperties = { padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }
const inputStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#0D1B2A', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }
const btnAmber: React.CSSProperties = { backgroundColor: '#C4891A', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }
const btnGhost: React.CSSProperties = { backgroundColor: 'transparent', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '9px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }
