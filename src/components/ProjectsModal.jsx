import React, { useEffect, useState } from 'react'
import API from '../utils/api'

function formatDate(dateStr) {
  try { return new Date(dateStr).toLocaleString() } catch { return '' }
}

export default function ProjectsModal({ open, onClose, onOpenProject }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await API.get('/projects')
        if (!cancelled) setProjects(res.data || [])
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || err.message || 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [open])

  // close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-11/12 max-w-2xl bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <h3 className="text-lg font-semibold">My Projects</h3>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">{projects.length} projects</div>
            <button onClick={onClose} className="text-sm text-gray-300 hover:text-white">Close</button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {loading && <div className="text-sm text-gray-400">Loading projects…</div>}
          {error && <div className="text-sm text-red-400">{error}</div>}
          {!loading && !error && projects.length === 0 && (
            <div className="text-sm text-gray-400">You have no projects yet.</div>
          )}

          <div className="flex flex-col gap-3">
            {projects.map(p => (
              <div
                key={p._id}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { onOpenProject ? onOpenProject(p) : navigator.clipboard?.writeText(p._id); onClose?.() } }}
                className="flex justify-between items-start bg-gray-800 border border-gray-700 rounded p-3 hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-semibold text-sm text-white truncate max-w-[65%]">{p.title || 'Untitled'}</div>
                    <div className="text-xs text-gray-400">{formatDate(p.updatedAt)}</div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{(p.html || '').replace(/\s+/g, ' ').slice(0, 200) || '(no preview)'}</div>
                </div>
                <div className="flex-shrink-0 flex flex-col gap-2 ml-2">
                  <button
                    onClick={() => { onOpenProject ? onOpenProject(p) : navigator.clipboard?.writeText(p._id); onClose?.() }}
                    aria-label={`Open project ${p.title || 'Untitled'}`}
                    className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-xs font-medium"
                  >Open</button>
                  <button
                    onClick={() => navigator.clipboard?.writeText(p._id)}
                    aria-label={`Copy id for ${p.title || 'Untitled'}`}
                    className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-xs"
                  >Copy ID</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
