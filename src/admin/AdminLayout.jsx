import { useState } from 'react'
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Image, Tag, Settings,
  ExternalLink, LogOut, Menu, X, ChevronRight, Inbox,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/demandes',   icon: Inbox,           label: 'Demandes' },
  { to: '/admin/produits',   icon: ShoppingBag,     label: 'Produits' },
  { to: '/admin/realisations', icon: Image,         label: 'Réalisations' },
  { to: '/admin/tarifs',     icon: Tag,             label: 'Tarifs' },
  { to: '/admin/parametres', icon: Settings,        label: 'Paramètres' },
]

const PAGE_TITLES = {
  '/admin/dashboard':    'Tableau de bord',
  '/admin/demandes':     'Demandes reçues',
  '/admin/produits':     'Produits',
  '/admin/realisations': 'Réalisations',
  '/admin/tarifs':       'Tarifs',
  '/admin/parametres':   'Paramètres',
}

function Logo() {
  return (
    <div>
      <span className="font-nunito font-black text-white text-lg">JO</span>
      <span className="font-nunito font-black text-jp-cyan text-lg"> PRIME</span>
      <span className="font-nunito font-semibold text-jp-blue2 text-lg"> Print</span>
    </div>
  )
}

function SidebarContent({ onClose }) {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('admin_auth')
    sessionStorage.removeItem('admin_key')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <Logo />
        <span className="mt-2 inline-block bg-jp-cyan text-white font-nunito font-bold text-xs rounded-full px-3 py-0.5 tracking-widest">
          ADMIN
        </span>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-nunito font-semibold text-sm transition-colors ${
                    isActive
                      ? 'bg-jp-blue text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-white/10 space-y-0.5">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white font-nunito text-sm transition-colors"
        >
          <ExternalLink size={17} className="shrink-0" />
          Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-300 font-nunito text-sm transition-colors"
        >
          <LogOut size={17} className="shrink-0" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const pageTitle = PAGE_TITLES[pathname] || 'Administration'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-jp-graphite shrink-0">
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-60 bg-jp-graphite flex flex-col shadow-2xl">
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={22} />
            </button>
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-[60px] bg-white border-b border-jp-gray flex items-center justify-between px-5 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-jp-graphite p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <nav className="flex items-center gap-1.5 font-nunito text-sm text-jp-gray2">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="font-semibold text-jp-graphite">{pageTitle}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-jp-cyan flex items-center justify-center">
              <span className="font-nunito font-black text-white text-xs">AD</span>
            </div>
            <span className="font-nunito font-semibold text-jp-graphite text-sm hidden sm:block">
              Administrateur
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
