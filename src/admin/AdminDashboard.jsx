import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Image, Clock, Globe, ShoppingBag, Tag, Settings } from 'lucide-react'
import { getProduits, getRealisations } from '../hooks/useSupabaseSite'

function SkeletonRow() {
  return <div className="h-12 bg-jp-gray rounded animate-pulse" />
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ produits: 0, realisations: 0 })
  const [recentes, setRecentes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [produits, realisations] = await Promise.all([
          getProduits(),
          getRealisations(),
        ])
        setStats({
          produits: produits.filter(p => p.actif).length,
          realisations: realisations.filter(r => r.actif).length,
        })
        setRecentes(realisations.slice(0, 5))
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const STAT_CARDS = [
    { icon: Package, label: 'Produits actifs', value: stats.produits, bg: 'bg-jp-blue', dynamic: true },
    { icon: Image, label: 'Réalisations publiées', value: stats.realisations, bg: 'bg-jp-blue2', dynamic: true },
    { icon: Clock, label: 'Express 24h', badge: '● Disponible', bg: 'bg-green-600', dynamic: false },
    { icon: Globe, label: 'Site en ligne', badge: '● En ligne', bg: 'bg-jp-cyan', dynamic: false },
  ]

  const QUICK_ACCESS = [
    { to: '/admin/produits', icon: ShoppingBag, label: 'Gérer les produits', bg: 'bg-jp-blue' },
    { to: '/admin/realisations', icon: Image, label: 'Gérer les réalisations', bg: 'bg-jp-blue2' },
    { to: '/admin/tarifs', icon: Tag, label: 'Modifier les tarifs', bg: 'bg-jp-cyan' },
    { to: '/admin/parametres', icon: Settings, label: 'Paramètres du site', bg: 'bg-jp-graphite' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-roboto font-bold text-2xl text-jp-graphite">Tableau de bord</h1>
        <p className="font-nunito text-jp-gray2 text-sm mt-1">Bienvenue dans votre espace d'administration JO Prime Print.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ icon: Icon, label, value, badge, bg, dynamic }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-jp-gray">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white" />
            </div>
            {loading && dynamic ? (
              <div className="h-9 w-14 bg-jp-gray rounded animate-pulse mb-1" />
            ) : dynamic ? (
              <p className="font-nunito font-black text-3xl text-jp-graphite">{value}</p>
            ) : (
              <p className="font-nunito font-bold text-green-600 text-sm">{badge}</p>
            )}
            <p className="font-nunito text-jp-gray2 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Accès rapides */}
      <div>
        <h2 className="font-nunito font-bold text-jp-graphite mb-4 text-base">Accès rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACCESS.map(({ to, icon: Icon, label, bg }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-xl p-5 shadow-sm border border-jp-gray hover:border-jp-cyan hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="font-nunito font-semibold text-jp-graphite text-sm group-hover:text-jp-blue transition-colors leading-tight">
                {label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Dernières réalisations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-nunito font-bold text-jp-graphite text-base">Dernières réalisations ajoutées</h2>
          <Link to="/admin/realisations" className="font-nunito text-jp-cyan text-sm hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-jp-gray overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
            </div>
          ) : recentes.length === 0 ? (
            <div className="p-10 text-center font-nunito text-jp-gray2 text-sm">
              Aucune réalisation pour l'instant.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-jp-gray bg-gray-50">
                    {['Titre', 'Catégorie', 'Date', 'Statut'].map(h => (
                      <th
                        key={h}
                        className={`text-left px-5 py-3 font-nunito font-semibold text-jp-gray2 text-xs uppercase tracking-wider ${h === 'Date' ? 'hidden sm:table-cell' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentes.map((r, i) => (
                    <tr key={r.id} className={i < recentes.length - 1 ? 'border-b border-jp-gray' : ''}>
                      <td className="px-5 py-3.5">
                        <span className="font-nunito font-semibold text-jp-graphite text-sm">{r.titre}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-jp-cyan-l text-jp-blue font-nunito text-xs font-semibold rounded-full px-2.5 py-0.5">
                          {r.categorie}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="font-nunito text-jp-gray2 text-xs">
                          {new Date(r.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`font-nunito text-xs font-semibold rounded-full px-2.5 py-0.5 ${r.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {r.actif ? 'Publié' : 'Masqué'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
