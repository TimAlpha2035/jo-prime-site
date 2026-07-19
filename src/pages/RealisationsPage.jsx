import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, FileImage, Flag, Copy, Layers, AlignJustify } from 'lucide-react'
import { getRealisations } from '../hooks/useSupabaseSite'

const ICON_MAP = {
  'Cartes de visite': CreditCard,
  'Affiches & Flyers': FileImage,
  'Bâches': Flag,
  'Photocopies': Copy,
  'Décoration': Layers,
  'Kakémonos': AlignJustify,
}

const BG_MAP = {
  'Cartes de visite': 'bg-jp-blue',
  'Affiches & Flyers': 'bg-jp-cyan',
  'Bâches': 'bg-jp-graphite',
  'Photocopies': 'bg-jp-blue2',
  'Décoration': 'bg-jp-blue',
  'Kakémonos': 'bg-jp-blue2',
}

const CATEGORY_ORDER = ['Cartes de visite', 'Affiches & Flyers', 'Bâches', 'Photocopies', 'Décoration', 'Kakémonos']

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-jp-gray animate-pulse">
      <div className="h-52 bg-jp-gray" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-jp-gray rounded w-3/4" />
        <div className="h-3 bg-jp-gray rounded w-1/2" />
      </div>
    </div>
  )
}

function RealisationCard({ item }) {
  const bg = BG_MAP[item.categorie] ?? 'bg-jp-blue'
  const Icon = ICON_MAP[item.categorie] ?? FileImage

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-jp-gray hover:border-jp-cyan hover:shadow-xl transition-all duration-300 cursor-default">
      {/* Image ou fond coloré */}
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.titre}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className={`${bg} h-52 flex items-center justify-center`}>
          <Icon
            size={72}
            className="text-white/15 group-hover:scale-110 group-hover:text-white/20 transition-all duration-500"
          />
        </div>
      )}

      {/* Badge catégorie */}
      <div className="absolute bottom-[84px] left-3">
        <span className="bg-white/90 text-jp-blue font-nunito font-bold text-xs rounded-full px-3 py-1 shadow-sm">
          {item.categorie}
        </span>
      </div>

      {/* Overlay hover */}
      <div className="absolute inset-0 bg-jp-graphite/85 flex flex-col justify-center items-center px-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="font-nunito font-semibold text-jp-cyan text-xs uppercase tracking-widest mb-2">
          {item.categorie}
        </span>
        <h3 className="font-nunito font-black text-white text-base mb-2 leading-snug">
          {item.titre}
        </h3>
        {item.description && (
          <p className="font-nunito text-white/70 text-sm leading-relaxed line-clamp-3">
            {item.description}
          </p>
        )}
      </div>

      {/* Infos bas de carte */}
      <div className="p-4 bg-white">
        <h3 className="font-nunito font-bold text-jp-graphite text-sm leading-snug">{item.titre}</h3>
        {item.description && (
          <p className="font-nunito text-jp-gray2 text-xs mt-0.5 truncate">{item.description}</p>
        )}
      </div>
    </div>
  )
}

export default function RealisationsPage() {
  const [realisations, setRealisations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Tout')
  const [error, setError] = useState(false)

  useEffect(() => {
    getRealisations(true)
      .then(setRealisations)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'Tout'
    ? realisations
    : realisations.filter(r => r.categorie === activeFilter)

  const filters = ['Tout', ...CATEGORY_ORDER.filter(cat => realisations.some(r => r.categorie === cat))]

  return (
    <main>
      {/* ── HERO ── */}
      <section className="py-16 bg-jp-blue">
        <div className="max-w-7xl mx-auto px-4 text-white text-center">
          <h1 className="font-roboto font-bold text-3xl md:text-5xl mb-3">Nos Réalisations</h1>
          <p className="font-nunito text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
            Découvrez quelques-uns de nos travaux réalisés pour nos clients
            à Conakry et partout en Guinée.
          </p>
        </div>
      </section>

      {/* ── FILTRES + GRILLE ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filtres */}
          {!loading && filters.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`font-nunito font-semibold text-sm rounded-full px-5 py-2 border transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-jp-blue text-white border-jp-blue shadow-md'
                    : 'border-jp-gray text-jp-graphite hover:bg-jp-cyan-l hover:border-jp-cyan'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          )}

          {/* Contenu */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <p className="text-center font-nunito text-jp-gray2 py-16">
              Impossible de charger les réalisations. Réessayez plus tard.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center font-nunito text-jp-gray2 py-16">
              Aucune réalisation dans cette catégorie pour l'instant.
            </p>
          ) : (
            <>
              <p className="font-nunito text-jp-gray2 text-sm text-center mb-8">
                {filtered.length} réalisation{filtered.length > 1 ? 's' : ''}
                {activeFilter !== 'Tout' ? ` en "${activeFilter}"` : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                  <RealisationCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 bg-jp-cyan-l">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-roboto font-bold text-2xl md:text-3xl text-jp-graphite mb-3">
            Votre projet ici ?
          </h2>
          <p className="font-nunito text-jp-gray2 text-lg mb-8">
            Rejoignez nos clients satisfaits — obtenez un devis gratuit en 2 heures.
          </p>
          <Link
            to="/devis"
            className="inline-block bg-jp-blue text-white font-nunito font-bold rounded-full px-10 py-3.5 hover:bg-jp-blue2 transition-colors shadow-md"
          >
            Demander un devis
          </Link>
        </div>
      </section>
    </main>
  )
}
