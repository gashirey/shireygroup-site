'use client'

import { useEffect, useState, useCallback } from 'react'

type HotStatus = 'waiting' | 'confirmed' | 'standdown'

interface HotRow {
  id: number
  event_id: number
  contractor_id: number
  rank_wave: number
  hot_status: HotStatus
  response: string
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

type SortKey = 'rank_wave' | 'last_name' | 'grade' | 'power_hours' | 'hot_status'
type SortDir = 'asc' | 'desc'

const HOT_STATUS_STYLES: Record<HotStatus, { bg: string; color: string; label: string }> = {
  waiting:   { bg: '#FEF9C3', color: '#854D0E', label: 'Waiting' },
  confirmed: { bg: '#DCFCE7', color: '#166534', label: 'Confirmed' },
  standdown: { bg: '#F3F4F6', color: '#4B5563', label: 'Stand Down' },
}

const HOT_STATUS_CYCLE: HotStatus[] = ['waiting', 'confirmed', 'standdown']

export default function HotListPage() {
  const [events, setEvents] = useState<DeploymentEvent[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [rows, setRows] = useState<HotRow[]>([])
  const [loading, setLoading] = useState(false)
  const [filterWave, setFilterWave] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('rank_wave')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
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
    const hotRows = (Array.isArray(d) ? d : []).filter(
      (r: HotRow) => r.response === 'YES' && r.rank_wave != null
    )
    setRows(hotRows)
    setLoading(false)
  }, [])

  useEffect(() => { if (selectedEventId) fetchRows(selectedEventId) }, [selectedEventId, fetchRows])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  async function cycleHotStatus(row: HotRow) {
    const idx = HOT_STATUS_CYCLE.indexOf(row.hot_status)
    const next = HOT_STATUS_CYCLE[(idx + 1) % HOT_STATUS_CYCLE.length]
    setSaving(s => ({ ...s, [row.id]: true }))
    await fetch('/api/ops/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: row.event_id, contractor_id: row.contractor_id, hot_status: next }),
    })
    setRows(rs => rs.map(r => r.id === row.id ? { ...r, hot_status: next } : r))
    setSaving(s => ({ ...s, [row.id]: false }))
  }

  const filtered = rows.filter(r => {
    if (filterWave && String(r.rank_wave) !== filterWave) return false
    if (filterStatus && r.hot_status !== filterStatus) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    let av: string | number, bv: string | number
    switch (sortKey) {
      case 'rank_wave':   av = a.rank_wave ?? 999; bv = b.rank_wave ?? 999; break
      case 'last_name':   av = a.contractor.last_name; bv = b.contractor.last_name; break
      case 'grade':       av = a.contractor.grade; bv = b.contractor.grade; break
      case 'power_hours': av = a.contractor.power_hours; bv = b.contractor.power_hours; break
      case 'hot_status':  av = a.hot_status; bv = b.hot_status; break
      default:            av = 0; bv = 0
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ color: '#D1D5DB', marginLeft: '4px' }}>↕</span>
    return <span style={{ color: '#C4891A', marginLeft: '4px' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  function thSortable(label: string, col: SortKey) {
    return (
      <th
        onClick={() => handleSort(col)}
        style={{ ...thStyle, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
      >
        {label}<SortIcon col={col} />
      </th>
    )
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={pageTitle}>HOT LIST</h1>
        <div style={{ fontSize: '13px', color: '#6B7280' }}>
          YES responses with rank wave assigned
        </div>
      </div>

      {/* Event selector + filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} style={{ ...inputStyle, minWidth: '220px' }}>
          <option value="">Select an event…</option>
          {events.map(e => <option key={e.id} value={String(e.id)}>{e.event_name}</option>)}
        </select>
        <input
          type="number"
          placeholder="Wave #"
          value={filterWave}
          onChange={e => setFilterWave(e.target.value)}
          style={{ ...inputStyle, width: '100px' }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: '150px' }}>
          <option value="">All Statuses</option>
          <option value="waiting">Waiting</option>
          <option value="confirmed">Confirmed</option>
          <option value="standdown">Stand Down</option>
        </select>
      </div>

      <div style={card}>
        {!selectedEventId ? (
          <div style={emptyState}>Select an event above.</div>
        ) : loading ? (
          <div style={emptyState}>Loading…</div>
        ) : sorted.length === 0 ? (
          <div style={emptyState}>No YES responses with rank waves set for this event.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E5E7EB' }}>
                {thSortable('Wave', 'rank_wave')}
                <th style={thStyle}>Badge</th>
                {thSortable('Name', 'last_name')}
                {thSortable('Grade', 'grade')}
                <th style={thStyle}>Subnetwork</th>
                <th style={thStyle}>State</th>
                {thSortable('Power Hrs', 'power_hours')}
                <th style={thStyle}>Phone</th>
                {thSortable('Hot Status', 'hot_status')}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const hs = HOT_STATUS_STYLES[row.hot_status] ?? HOT_STATUS_STYLES.waiting
                const c = row.contractor
                return (
                  <tr key={row.id} style={{ borderBottom: i < sorted.length - 1 ? '1px solid #F3F4F6' : 'none', opacity: saving[row.id] ? 0.6 : 1 }}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#C4891A', textAlign: 'center' }}>
                      {row.rank_wave}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, fontFamily: 'monospace', color: '#0D1B2A' }}>{c.badge}</td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{c.last_name}, {c.first_name}</td>
                    <td style={tdStyle}>
                      <span style={{ ...gradeColors[c.grade], padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
                        {c.grade}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: '#6B7280' }}>{c.subnetwork || '—'}</td>
                    <td style={tdStyle}>{c.home_state || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{c.power_hours.toLocaleString()}</td>
                    <td style={{ ...tdStyle, color: '#6B7280' }}>{c.phone || '—'}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => cycleHotStatus(row)}
                        disabled={saving[row.id]}
                        style={{ backgroundColor: hs.bg, color: hs.color, border: 'none', borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", minWidth: '72px' }}
                      >
                        {hs.label}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && selectedEventId && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#9CA3AF' }}>
          {sorted.length} on hot list · {rows.filter(r => r.hot_status === 'confirmed').length} confirmed · {rows.filter(r => r.hot_status === 'standdown').length} stand down
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
const inputStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#0D1B2A', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }
