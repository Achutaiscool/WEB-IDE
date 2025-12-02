import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/Header'
import EditorPane from './components/EditorPane'

export default function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [loadProject, setLoadProject] = useState(null)
  useEffect(() => {
    if (!token) navigate('/login')
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header onOpenProject={(p) => setLoadProject(p)} />
      <div className="flex flex-1">
        <EditorPane loadProject={loadProject} />
      </div>
    </div>
  )
}
