'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface Contractor {
  id: number
  badge: string
  last_name: string
  first_name: string
  grade: string
  subnetwork: string | null
  home_state: string | null
  power_hours: number
  telecom_hours: number
  total_hours: number
  phone: string | null
  email: string | null
  active: boolean
}

interface ImportResult {
  filename: string
  rows_imported: number
  rows_updated: number
  rows_skipped: number
}

const GRADES = ['A', 'B', 'C', 'New']

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [grade, setGrade] = useState('')
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchContractors = useCallback(async (s: string, g: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (s) params.set('search', s)
    if (g) params.set('grade', g)
    const res = await fetch(`/api/ops/contractors?${params.toString()}`)
    const data = await res.json()
    setContractors(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => fetchContractors(search, grade), 300)
  }, [search, grade, fetchContractors])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setImportError('')
    setImportResult(null)

    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch('/api/ops/import', { method: 'POST', body: fd })
    const data = await res.json()

    if (!res.ok) {
      setImportError(data.error ?? 'Import failed.')
    } else {
      setImportResult(data)
      fetchContractors(search, grade)
    }
    setImporting(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const gradeColors: Record<string, { bg: string; color: string }> = {
    A: { bg: '#DCFCE7', color: '#166534' },
    B: { bg: '#DBEAFE', color: '#1E40AF' },
    C: { bg: '#FEF9C3', color: '#854D0E' },
    New: { bg: '#F3F4F6', color: '#4B5563' },
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={pageTitle}>CONTRACTOR ROSTER</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="file" accept=".csv" ref={fileRef} onChange={handleFileChange} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} disabled={importing} style={btnAmber}>
            {importing ? 'Importing…' : '↑ Import CSV'}
          </button>
        </div>
      </div>

      {/* Import result */}
      {importResult && (
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#166534' }}>
          <strong>{importResult.filename}</strong> — {importResult.rows_imported} inserted, {importResult.rows_updated} updated, {importResult.rows_skipped} skipped
        </div>
      )}
      {importError && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#B91C1C' }}>
          {importError}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by badge, name, or subnetwork…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: '1', minWidth: '220px' }}
        />
        <select value={grade} onChange={e => setGrade(e.target.value)} style={{ ...inputStyle, width: '140px' }}>
          <option value="">All Grades</option>
          {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={card}>
        {loading ? (
          <div style={emptyState}>Loading…</div>
        ) : contractors.length === 0 ? (
          <div style={emptyState}>No contractors found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F7F7F5', borderBottom: '1px solid #E5E7EB' }}>
                {['Badge', 'Name', 'Grade', 'Subnetwork', 'State', 'Power Hrs', 'Phone', 'Email'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contractors.map((c, i) => {
                const gc = gradeColors[c.grade] ?? gradeColors.New
                return (
                  <tr key={c.id} style={{ borderBottom: i < contractors.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <td style={{ ...tdStyle, fontWeight: 600, fontFamily: 'monospace', color: '#0D1B2A' }}>{c.badge}</td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{c.last_name}, {c.first_name}</td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: gc.bg, color: gc.color, padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
                        {c.grade}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: '#6B7280' }}>{c.subnetwork || '—'}</td>
                    <td style={tdStyle}>{c.home_state || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{c.power_hours.toLocaleString()}</td>
                    <td style={{ ...tdStyle, color: '#6B7280' }}>{c.phone || '—'}</td>
                    <td style={{ ...tdStyle, color: '#6B7280' }}>{c.email || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#9CA3AF' }}>
        {!loading && `${contractors.length} contractor${contractors.length !== 1 ? 's' : ''}`}
      </div>
    </div>
  )
}

const pageTitle: React.CSSProperties = { margin: 0, fontSize: '24px', fontWeight: 700, color: '#0D1B2A', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }
const card: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden', borderTop: '3px solid #C4891A' }
const emptyState: React.CSSProperties = { padding: '48px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }
const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }
const tdStyle: React.CSSProperties = { padding: '11px 16px', color: '#374151', verticalAlign: 'middle' }
const inputStyle: React.CSSProperties = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#0D1B2A', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF' }
const btnAmber: React.CSSProperties = { backgroundColor: '#C4891A', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }
