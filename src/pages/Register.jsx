import React, { useState } from 'react'
import API from '../utils/api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/auth/register', { username, email, password })
      localStorage.setItem('token', res.data.token)
      location.href = '/'
    } catch (err) { alert('Register failed') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={submit} className="w-[360px] bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-white">Register</h2>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username"
               className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-white focus:outline-none" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
               className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-white focus:outline-none" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
               className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white focus:outline-none" />
        <button type="submit" className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500">Register</button>
        <div className="mt-3 text-sm text-gray-300">
          <a href="/login" className="text-indigo-400 hover:underline">Login</a>
        </div>
      </form>
    </div>
  )
}
