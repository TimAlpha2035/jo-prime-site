import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Menu, X, ChevronDown,
  CreditCard, FileImage, Flag, Copy, Layers, AlignJustify,
} from 'lucide-react'

const PRODUCTS = [
  { to: '/cartes-de-visite', icon: CreditCard, label: 'Cartes de visite' },
  { to: '/affiches-flyers', icon: FileImage, label: 'Affiches & Flyers' },
  { to: '/baches-banderoles', icon: Flag, label: 'Bâches & Banderoles' },
  { to: '/photocopies', icon: Copy, label: 'Photocopies & Impression' },
  { to: '/decoration-stickers', icon: Layers, label: 'Décoration & Stickers' },
  { to: '/kakemonos', icon: AlignJustify, label: 'Kakémonos & Roll-up' },
]

const NAV_LINKS = [
  { to: '/realisations', label: 'Réalisations' },
  { to: '/devis', label: 'Devis' },
  { to: '/contact', label: 'Contact' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center shrink-0">
      <span className="font-nunito font-black text-jp-blue text-xl">JO</span>
      <span className="font-nunito font-black text-jp-cyan text-xl">&nbsp;PRIME</span>
      <span className="font-nunito font-semibold text-jp-blue2 text-xl">&nbsp;Print</span>
    </Link>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-1 font-nunito font-semibold text-jp-graphite hover:text-jp-cyan transition-colors"
            >
              Nos produits
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-jp-gray py-2 z-50">
                {PRODUCTS.map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-jp-graphite hover:bg-jp-cyan-l hover:text-jp-blue transition-colors"
                  >
                    <Icon size={18} className="text-jp-blue shrink-0" />
                    <span className="font-nunito text-sm">{label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-nunito font-semibold transition-colors pb-1 border-b-2 ${
                  isActive
                    ? 'text-jp-blue border-jp-cyan'
                    : 'text-jp-graphite border-transparent hover:text-jp-cyan hover:border-jp-cyan'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA desktop */}
        <Link
          to="/devis"
          className="hidden md:inline-flex items-center bg-jp-cyan text-white font-nunito font-semibold rounded-full px-5 py-2 hover:bg-jp-blue transition-colors shrink-0"
        >
          Demander un devis
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden text-jp-graphite p-1"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Cyan underline */}
      <div className="h-0.5 bg-jp-cyan" />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative ml-auto w-72 max-w-full bg-white h-full overflow-y-auto flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
                <X size={24} className="text-jp-graphite" />
              </button>
            </div>

            <p className="font-nunito font-bold text-jp-gray2 text-xs uppercase tracking-widest mb-3">
              Nos produits
            </p>

            {PRODUCTS.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 border-b border-jp-gray text-jp-graphite hover:text-jp-cyan transition-colors"
              >
                <Icon size={18} className="text-jp-blue shrink-0" />
                <span className="font-nunito">{label}</span>
              </Link>
            ))}

            <div className="mt-5 flex flex-col">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="font-nunito font-semibold text-jp-graphite hover:text-jp-cyan transition-colors py-3 border-b border-jp-gray"
                >
                  {label}
                </Link>
              ))}
            </div>

            <Link
              to="/devis"
              onClick={() => setMobileOpen(false)}
              className="mt-6 block text-center bg-jp-cyan text-white font-nunito font-semibold rounded-full px-5 py-3 hover:bg-jp-blue transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
