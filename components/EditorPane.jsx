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
      <div className="w-[40%] min-w-[360px] p-3 flex flex-col gap-3 bg-gray-900 border-r border-gray-800">
        <div className="flex gap-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title"
                 className="flex-1 px-3 py-2 rounded bg-gray-800 text-gray-100 focus:outline-none" />
          <button onClick={save} className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500">Save</button>
        </div>

        <div className="space-y-3 overflow-auto">
          <section className="bg-gray-800 p-3 rounded">
            <div className="flex justify-between mb-2">
              <strong className="text-sm">{"< HTML >"}</strong>
            </div>
            <textarea value={html} onChange={e => setHtml(e.target.value)}
                      className="w-full h-40 bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm" />
          </section>

          <section className="bg-gray-800 p-3 rounded">
            <div className="flex justify-between mb-2">
              <strong className="text-sm">CSS</strong>
            </div>
            <textarea value={css} onChange={e => setCss(e.target.value)}
                      className="w-full h-36 bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm" />
          </section>

          <section className="bg-gray-800 p-3 rounded">
            <div className="flex justify-between mb-2">
              <strong className="text-sm">JS</strong>
            </div>
            <textarea value={js} onChange={e => setJs(e.target.value)}
                      className="w-full h-56 bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm" />
          </section>
        </div>
      </div>

      <div className="flex-1 bg-white p-3">
        <iframe ref={iframeRef} title="preview"
                className="w-full h-full border-none bg-white" sandbox="allow-scripts allow-same-origin" />
      </div>
    </>
  )
}
