import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import API from '../utils/api'

export default function ProjectsDropdown({ anchorRef, open, onClose, onOpenProject }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const containerRef = useRef()
  const [pos, setPos] = useState({ top: 0, left: 0, width: 520 })

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

  // close on outside click (works when rendered in body)
  useEffect(() => {
    if (!open) return
    function onDoc(e) {
      if (containerRef.current && !containerRef.current.contains(e.target) && !anchorRef?.current?.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, onClose, anchorRef])

  // position dropdown under anchorRef using portal
  useEffect(() => {
    function updatePos() {
      try {
        const btn = anchorRef?.current
        if (!btn) return
        const rect = btn.getBoundingClientRect()
        const desiredWidth = Math.min(520, window.innerWidth - 32)
        // align right edge of dropdown with button's right edge if possible
        let left = rect.right - desiredWidth
        if (left < 8) left = 8
        if (left + desiredWidth > window.innerWidth - 8) left = window.innerWidth - desiredWidth - 8
        const top = rect.bottom + window.scrollY + 8
        setPos({ top, left, width: desiredWidth })
      } catch (e) { /* ignore */ }
    }
    if (open) {
      updatePos()
      window.addEventListener('resize', updatePos)
      window.addEventListener('scroll', updatePos, true)
    }
    return () => {
      window.removeEventListener('resize', updatePos)
      window.removeEventListener('scroll', updatePos, true)
    }
  }, [open, anchorRef])

  if (!open) return null

  return createPortal(
    <div ref={containerRef} style={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }} className="bg-gray-900 text-white rounded-lg shadow-lg border border-gray-800">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="text-sm font-semibold">My Projects</div>
        <div className="text-xs text-gray-400">{projects.length} items</div>
      </div>
      <div className="p-3 max-h-[50vh] overflow-y-auto">
        {loading && <div className="text-sm text-gray-400">Loading…</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
        {!loading && !error && projects.length === 0 && <div className="text-sm text-gray-400">No projects</div>}
        <div className="flex flex-col gap-2">
          {projects.map(p => (
            <div key={p._id} className="flex items-start justify-between gap-3 p-2 rounded hover:bg-gray-800">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-sm truncate">{p.title || 'Untitled'}</div>
                  <div className="text-xs text-gray-400">{new Date(p.updatedAt).toLocaleString()}</div>
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate">{(p.html || '').replace(/\s+/g, ' ').slice(0, 140) || '(no preview)'}</div>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-2">
                <button onClick={() => { onOpenProject?.(p); onClose?.() }} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs">Open</button>
                <button onClick={() => navigator.clipboard?.writeText(p._id)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">Copy ID</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>, document.body
  )
}
