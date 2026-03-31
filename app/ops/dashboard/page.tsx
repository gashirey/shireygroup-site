'use client'

import { useEffect, useState, useCallback } from 'react'

type EventStatus = 'warning' | 'active' | 'standdown' | 'closed'
type EventType = 'reactive' | 'proactive'

interface DeploymentEvent {
  id: number
  event_name: string
  storm_name: string | null
  event_type: EventType
  pu_client: string | null
  affected_states: string | null
  warning_order_date: string | null
  mobilization_date: string | null
  estimated_crew_count: number | null
  status: EventStatus
  notes: string | null
  created_on: string
}

const STATUS_STYLES: Record<EventStatus, { bg: string; color: string; label: string }> = {
  warning:   { bg: '#FEF9C3', color: '#854D0E', label: 'Warning' },
  active:    { bg: '#DCFCE7', color: '#166534', label: 'Active' },
  standdown: { bg: '#F3F4F6', color: '#4B5563', label: 'Stand Down' },
  closed:    { bg: '#DBEAFE', color: '#1E3A5F', label: 'Closed' },
}

const EMPTY_FORM = {
  event_name: '',
  storm_name: '',
  event_type: 'reactive' as EventType,
  pu_client: '',
  affected_states: '',
  warning_order_date: '',
  mobilization_date: '',
  estimated_crew_count: '',
  status: 'warning' as EventStatus,
  notes: '',
}

export default function DashboardPage() {
  const [events, setEvents] = useState<DeploymentEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<DeploymentEvent | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/ops/events')
    const data = await res.json()
    setEvents(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  function openNew() {
    setEditingEvent(null)
    setForm(EMPTY_FORM)
    setError('')
    setModalOpen(true)
  }

  function openEdit(ev: DeploymentEvent) {
    setEditingEvent(ev)
    setForm({
      event_name: ev.event_name,
      storm_name: ev.storm_name ?? '',
      event_type: ev.event_type,
      pu_client: ev.pu_client ?? '',
      affected_states: ev.affected_states ?? '',
      warning_order_date: ev.warning_order_date ?? '',
      mobilization_date: ev.mobilization_date ?? '',
      estimated_crew_count: ev.estimated_crew_count?.toString() ?? '',
      status: ev.status,
      notes: ev.notes ?? '',
    })
    setError('')
    setModalOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.event_name.trim()) { setError('Event name is required.'); return }
    setSaving(true)
    setError('')

    const payload = editingEvent ? { ...form, id: editingEvent.id } : form
    const res = await fetch('/api/ops/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Failed to save.')
      setSaving(false)
      return
    }

    setModalOpen(false)
    fetchEvents()
    setSaving(false)
  }

  function fmtDate(d: string | null) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0D1B2A', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }}>
          DEPLOYMENT EVENTS
        </h1>
        <button onClick={openNew} style={btnAmber}>+ New Event</button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden', borderTop: '3px solid #C4891A' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>Loading…</div>
        ) : events.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>No events yet. Create one to get started.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E5E7EB' }}>
                {['Event Name', 'Storm', 'Type', 'PU Client', 'Status', 'Warning Order', 'Mobilization'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => {
                const s = STATUS_STYLES[ev.status] ?? STATUS_STYLES.closed
                return (
                  <tr
                    key={ev.id}
                    onClick={() => openEdit(ev)}
                    style={{
                      borderBottom: i < events.length - 1 ? '1px solid #F3F4F6' : 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#0D1B2A' }}>{ev.event_name}</td>
                    <td style={tdStyle}>{ev.storm_name || '—'}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '11px', textTransform: 'capitalize', color: '#6B7280' }}>{ev.event_type}</span>
                    </td>
                    <td style={tdStyle}>{ev.pu_client || '—'}</td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: s.bg, color: s.color, padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={tdStyle}>{fmtDate(ev.warning_order_date)}</td>
                    <td style={tdStyle}>{fmtDate(ev.mobilization_date)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div style={modalBox}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0D1B2A', fontFamily: "'Barlow Condensed', sans-serif" }}>
                {editingEvent ? 'EDIT EVENT' : 'NEW EVENT'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '20px', lineHeight: 1 }}>×</button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={rowStyle}>
                <Field label="Event Name *" style={{ flex: 2 }}>
                  <input value={form.event_name} onChange={e => setForm(f => ({ ...f, event_name: e.target.value }))} style={inputStyle} required />
                </Field>
                <Field label="Storm Name" style={{ flex: 1 }}>
                  <input value={form.storm_name} onChange={e => setForm(f => ({ ...f, storm_name: e.target.value }))} style={inputStyle} />
                </Field>
              </div>

              <div style={rowStyle}>
                <Field label="Event Type" style={{ flex: 1 }}>
                  <select value={form.event_type} onChange={e => setForm(f => ({ ...f, event_type: e.target.value as EventType }))} style={inputStyle}>
                    <option value="reactive">Reactive</option>
                    <option value="proactive">Proactive</option>
                  </select>
                </Field>
                <Field label="Status" style={{ flex: 1 }}>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as EventStatus }))} style={inputStyle}>
                    <option value="warning">Warning</option>
                    <option value="active">Active</option>
                    <option value="standdown">Stand Down</option>
                    <option value="closed">Closed</option>
                  </select>
                </Field>
                <Field label="PU Client" style={{ flex: 1 }}>
                  <input value={form.pu_client} onChange={e => setForm(f => ({ ...f, pu_client: e.target.value }))} style={inputStyle} />
                </Field>
              </div>

              <div style={rowStyle}>
                <Field label="Affected States" style={{ flex: 2 }}>
                  <input value={form.affected_states} onChange={e => setForm(f => ({ ...f, affected_states: e.target.value }))} style={inputStyle} placeholder="e.g. NC, SC, VA" />
                </Field>
                <Field label="Est. Crew Count" style={{ flex: 1 }}>
                  <input type="number" value={form.estimated_crew_count} onChange={e => setForm(f => ({ ...f, estimated_crew_count: e.target.value }))} style={inputStyle} />
                </Field>
              </div>

              <div style={rowStyle}>
                <Field label="Warning Order Date" style={{ flex: 1 }}>
                  <input type="date" value={form.warning_order_date} onChange={e => setForm(f => ({ ...f, warning_order_date: e.target.value }))} style={inputStyle} />
                </Field>
                <Field label="Mobilization Date" style={{ flex: 1 }}>
                  <input type="date" value={form.mobilization_date} onChange={e => setForm(f => ({ ...f, mobilization_date: e.target.value }))} style={inputStyle} />
                </Field>
              </div>

              <Field label="Notes">
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...inputStyle, minHeight: '72px', resize: 'vertical' }} />
              </Field>

              {error && <div style={errorBox}>{error}</div>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={btnGhost}>Cancel</button>
                <button type="submit" disabled={saving} style={btnAmber}>{saving ? 'Saving…' : editingEvent ? 'Save Changes' : 'Create Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      {children}
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }
const tdStyle: React.CSSProperties = { padding: '12px 16px', color: '#374151', verticalAlign: 'middle' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#0D1B2A', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }
const rowStyle: React.CSSProperties = { display: 'flex', gap: '12px' }
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }
const modalBox: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '32px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', borderTop: '3px solid #C4891A' }
const btnAmber: React.CSSProperties = { backgroundColor: '#C4891A', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }
const btnGhost: React.CSSProperties = { backgroundColor: 'transparent', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '9px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }
const errorBox: React.CSSProperties = { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#B91C1C' }
