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

export default function EditorPane() {
  const [html, setHtml] = useState(defaultHTML)
  const [css, setCss] = useState(defaultCSS)
  const [js, setJs] = useState(defaultJS)
  const [title, setTitle] = useState('Untitled')
  const iframeRef = useRef()

  useEffect(() => {
    const t = setTimeout(updatePreview, 200)
    return () => clearTimeout(t)
  }, [html, css, js])

  function updatePreview() {
    const srcDoc = `<!doctype html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`
    if (iframeRef.current) iframeRef.current.srcdoc = srcDoc
  }

  const save = async () => {
    try {
      await API.post('/projects', { title, html, css, js })
      alert('Saved')
    } catch (e) {
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
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Preview</p>
        </div>
        <iframe ref={iframeRef} title="preview"
                className="flex-1 border-none bg-white" sandbox="allow-scripts allow-same-origin" />
      </div>
    </>
  )
}
