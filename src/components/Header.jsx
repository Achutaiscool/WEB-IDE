import React from 'react'

export default function Header() {
  const logout = () => { localStorage.removeItem('token'); location.href = '/login' }
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-gray-800 border-b border-gray-700 text-white shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-sm">IDE</div>
        <h1 className="text-lg font-semibold">Mini WebIDE</h1>
      </div>
      <div>
        <button onClick={logout} className="px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium transition">
          Logout
        </button>
      </div>
    </header>
  )
}
