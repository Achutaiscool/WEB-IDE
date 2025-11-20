import React, { useState } from 'react'
import API from '../utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      location.href = '/'
    } catch (err) { alert('Login failed') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <form onSubmit={submit} className="w-full max-w-md bg-gray-800/50 backdrop-blur p-8 rounded-lg shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="font-bold text-white text-lg">IDE</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Mini WebIDE</h1>
          <p className="text-gray-400 text-sm mt-1">Code. Preview. Create.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
                   className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password"
                   className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
          </div>
        </div>
        
        <button type="submit" className="w-full mt-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition">
          Sign In
        </button>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          Don't have an account? <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition">Create one</a>
        </div>
      </form>
    </div>
  )
}
