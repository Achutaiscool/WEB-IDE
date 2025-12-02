import React, { useState, useEffect, useRef } from 'react'
import API from '../utils/api'

const defaultHTML = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Preview</title>
</head>
<body>
  <h1>Hello from WebIDE</h1>
</body>
</html>`
const defaultCSS = `body { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial; padding: 20px; } h1 { color: #22c55e; }`
const defaultJS = `console.log('Hello from JS')`

export default function EditorPane({ loadProject }) {
  const [html, setHtml] = useState(defaultHTML)
  const [css, setCss] = useState(defaultCSS)
  const [js, setJs] = useState(defaultJS)
  const [title, setTitle] = useState('Untitled')
  const iframeRef = useRef()
  const [previewError, setPreviewError] = useState(null)

  const updatePreview = () => {
    // clear any previous error when content changes
    setPreviewError(null)

    const errorHook = `<script>(function(){function send(p){try{window.parent.postMessage(p,'*')}catch(e){}}window.addEventListener('error',function(e){send({type:'webide-error',message:e.message,lineno:e.lineno,colno:e.colno,stack:e.error&&e.error.stack})});window.addEventListener('unhandledrejection',function(e){var r=e.reason||'Unhandled rejection';send({type:'webide-error',message:(r&&r.message)||r,stack:(r&&r.stack)||null})});var _c=console.error;console.error=function(){try{send({type:'webide-error',message:Array.from(arguments).map(a=>typeof a==='object'?JSON.stringify(a):String(a)).join(' ')})}catch(e){};return _c.apply(console,arguments)}})()</script>`

    const srcDoc = `<!doctype html><html><head><style>${css}</style></head><body>${html}${errorHook}<script>${js}</script></body></html>`
    if (iframeRef.current) iframeRef.current.srcdoc = srcDoc
  }

  useEffect(() => {
    if (!loadProject) return
    // load project contents into editor
    setTitle(loadProject.title || 'Untitled')
    setHtml(loadProject.html || '')
    setCss(loadProject.css || '')
    setJs(loadProject.js || '')
  }, [loadProject])

  useEffect(() => {
    const t = setTimeout(updatePreview, 200)
    return () => clearTimeout(t)
  }, [html, css, js])

  /* updatePreview moved above useEffect */

  useEffect(() => {
    function onMessage(e){
      // accept only messages from our iframe
      if (!iframeRef.current) return
      if (e.source !== iframeRef.current.contentWindow) return
      const data = e.data || {}
      if (data.type === 'webide-error'){
        setPreviewError({ message: data.message, stack: data.stack, lineno: data.lineno, colno: data.colno })
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [iframeRef])

  const save = async () => {
    try {
      await API.post('/projects', { title, html, css, js })
      alert('Saved')
    } catch {
      alert('Save failed')
    }
  }

  return (
    <>
      <div className="w-[45%] min-w-[380px] p-4 flex flex-col gap-4 bg-gray-900 border-r border-gray-800 overflow-hidden">
        {/* Project Info */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex gap-2">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title"
                   className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            <button onClick={save} className="px-4 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition whitespace-nowrap">
              Save
            </button>
          </div>
        </div>

        {/* Editors */}
        <div className="flex-1 space-y-3 overflow-auto">
          <section className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col">
            <strong className="text-sm text-indigo-400 mb-2 font-mono">{"< HTML >"}</strong>
            <textarea value={html} onChange={e => setHtml(e.target.value)}
                      className="flex-1 min-h-32 max-h-40 bg-gray-900 text-gray-100 p-2 rounded font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </section>

          <section className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col">
            <strong className="text-sm text-purple-400 mb-2 font-mono">CSS</strong>
            <textarea value={css} onChange={e => setCss(e.target.value)}
                      className="flex-1 min-h-28 max-h-36 bg-gray-900 text-gray-100 p-2 rounded font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </section>

          <section className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col">
            <strong className="text-sm text-yellow-400 mb-2 font-mono">JS</strong>
            <textarea value={js} onChange={e => setJs(e.target.value)}
                      className="flex-1 min-h-32 max-h-56 bg-gray-900 text-gray-100 p-2 rounded font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-yellow-500" />
          </section>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Preview</p>
        </div>

        {/* Error banner shown when iframe reports a JS error */}
        {previewError &&  (
          <div className="bg-red-50 border-l-4 border-red-400 border rounded-r mr-4 ml-4 mt-3 p-3 text-sm text-red-800 flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="font-semibold text-red-800" style={{color: '#b91c1c'}}>JavaScript error</div>
              <div className="mt-1 text-xs whitespace-pre-wrap text-red-700" style={{color: '#b91c1c'}}>{previewError.message}{previewError.lineno ? ` (line ${previewError.lineno}, col ${previewError.colno})` : ''}{previewError.stack ? '\n' + previewError.stack : ''}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => setPreviewError(null)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-800" style={{color: '#b91c1c'}}>Dismiss</button>
              <button onClick={() => navigator.clipboard?.writeText(previewError.message + (previewError.stack ? '\n' + previewError.stack : ''))} className="text-xs px-2 py-1 rounded bg-gray-100 text-red-800" style={{color: '#b91c1c'}}>Copy</button>
            </div>
          </div>
        )}

        <iframe ref={iframeRef} title="preview"
                className="flex-1 border-none bg-white" sandbox="allow-scripts allow-same-origin" />
      </div>
    </>
  )
}
