import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

          <div className="flex-1">
            <Topbar onMenuToggle={() => setMobileOpen((v) => !v)} />
            <main className="mt-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
