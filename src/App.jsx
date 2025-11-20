import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/Header'
import EditorPane from './components/EditorPane'

export default function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!token) navigate('/login')
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header />
      <div className="flex flex-1">
        <EditorPane />
      </div>
    </div>
  )
}
