import React from 'react'

export default function Header() {
  const logout = () => { localStorage.removeItem('token'); location.href = '/login' }
  return (
    <header className="h-16 flex items-center justify-between px-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold">IDE</div>
        <h1 className="text-lg font-semibold">Mini WebIDE</h1>
      </div>
      <div>
        <button onClick={logout} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">Logout</button>
      </div>
    </header>
  )
}
