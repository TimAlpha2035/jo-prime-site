import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppButton from './components/WhatsAppButton'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import DevisPage from './pages/DevisPage'
import RealisationsPage from './pages/RealisationsPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import FaqPage from './pages/FaqPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import PrivateAdminRoute from './admin/PrivateAdminRoute'
import AdminDashboard from './admin/AdminDashboard'
import AdminDemandes from './admin/AdminDemandes'
import AdminProduits from './admin/AdminProduits'
import AdminRealisations from './admin/AdminRealisations'
import AdminTarifs from './admin/AdminTarifs'
import AdminParametres from './admin/AdminParametres'
import { ParamsProvider } from './contexts/ParamsContext'

// Layout site public (Navbar + Footer + WhatsApp)
function SiteLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

// 404 avec le layout site (Navbar + Footer)
function Site404() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <NotFoundPage />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default function App() {
  return (
    <ParamsProvider>
      <ScrollToTop />
      <Routes>
        {/* ── Admin (routes explicites, jamais de path="*" ici) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<PrivateAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="demandes"     element={<AdminDemandes />} />
            <Route path="produits"     element={<AdminProduits />} />
            <Route path="realisations" element={<AdminRealisations />} />
            <Route path="tarifs"       element={<AdminTarifs />} />
            <Route path="parametres"   element={<AdminParametres />} />
          </Route>
        </Route>

        {/* ── Site public (routes explicites, sans path="*") ── */}
        <Route element={<SiteLayout />}>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/cartes-de-visite"  element={<ProductPage product="cartes-de-visite" />} />
          <Route path="/affiches-flyers"   element={<ProductPage product="affiches" />} />
          <Route path="/baches-banderoles" element={<ProductPage product="baches" />} />
          <Route path="/photocopies"       element={<ProductPage product="photocopies" />} />
          <Route path="/decoration-stickers" element={<ProductPage product="decoration" />} />
          <Route path="/kakemonos"         element={<ProductPage product="kakemonos" />} />
          <Route path="/devis"             element={<DevisPage />} />
          <Route path="/realisations"      element={<RealisationsPage />} />
          <Route path="/contact"           element={<ContactPage />} />
          <Route path="/a-propos"          element={<AboutPage />} />
          <Route path="/faq"               element={<FaqPage />} />
        </Route>

        {/* ── Catch-all au niveau racine — jamais intercepté par un layout ── */}
        <Route path="*" element={<Site404 />} />
      </Routes>
    </ParamsProvider>
  )
}
