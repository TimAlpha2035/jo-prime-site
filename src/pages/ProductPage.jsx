import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard, FileImage, Flag, Copy, Layers, AlignJustify,
  ChevronRight, ChevronDown, MousePointer, Upload, PackageCheck,
} from 'lucide-react'
import { getVariantesBySlug } from '../hooks/useSupabaseSite'
import { useParametresSite } from '../contexts/ParamsContext'
import { PRODUCTS_FAQ } from '../data/faqData'

/* ─────────────────────────────────────────────
   Données statiques par produit
   (variantes/prix gérés dans admin → Supabase)
───────────────────────────────────────────── */
const CATALOG = {
  'cartes-de-visite': {
    nom: 'Cartes de visite',
    tagline: 'Votre première impression compte',
    description:
      'Des cartes de visite professionnelles qui reflètent votre image de marque. Impression haute qualité, finitions premium.',
    icon: CreditCard,
    gradient: 'linear-gradient(135deg, #1B4F72 0%, #2471A3 100%)',
    options: ['Recto simple', 'Recto/Verso', 'Pelliculage brillant', 'Pelliculage mat', 'Coins arrondis', 'Vernis sélectif'],
    faq: PRODUCTS_FAQ['cartes-de-visite'].faq,
  },
  affiches: {
    nom: 'Affiches & Flyers',
    tagline: 'Faites passer votre message',
    description:
      "Impression d'affiches et flyers haute résolution pour tous vos besoins marketing et événementiels.",
    icon: FileImage,
    gradient: 'linear-gradient(135deg, #2471A3 0%, #1B4F72 100%)',
    options: ['A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'Papier standard', 'Papier couché', 'Plastifié'],
    faq: PRODUCTS_FAQ.affiches.faq,
  },
  baches: {
    nom: 'Bâches & Banderoles',
    tagline: 'Visibilité maximale pour votre marque',
    description:
      'Bâches publicitaires résistantes aux intempéries, idéales pour les événements, devantures et signalétique extérieure.',
    icon: Flag,
    gradient: 'linear-gradient(135deg, #1C2833 0%, #1B4F72 100%)',
    options: ['Frontlit', 'Mesh', 'Rétroéclairée', 'Avec œillets', 'Avec ourlet', 'Pose incluse'],
    faq: PRODUCTS_FAQ.baches.faq,
  },
  photocopies: {
    nom: 'Photocopies & Impression',
    tagline: 'Rapide, précis, professionnel',
    description:
      'Service de photocopie et impression numérique pour particuliers et entreprises. Noir & blanc ou couleur, avec options de reliure.',
    icon: Copy,
    gradient: 'linear-gradient(135deg, #1B4F72 0%, #1ABCE8 100%)',
    options: ['A4', 'A3', 'Recto', 'Recto/Verso', 'Reliure spirale', 'Reliure thermique', 'Plastification'],
    faq: PRODUCTS_FAQ.photocopies.faq,
  },
  decoration: {
    nom: 'Décoration & Stickers',
    tagline: 'Personnalisez votre espace',
    description:
      'Stickers, adhésifs muraux, vitrophanie et panneaux rigides pour décorer et communiquer dans vos locaux.',
    icon: Layers,
    gradient: 'linear-gradient(135deg, #2471A3 0%, #1C2833 100%)',
    options: ['Vinyle blanc', 'Vinyle transparent', 'Dépoli', 'Dibond', 'Forex', 'Découpé au traceur'],
    faq: PRODUCTS_FAQ.decoration.faq,
  },
  kakemonos: {
    nom: 'Kakémonos & Roll-up',
    tagline: 'Présentez-vous avec style',
    description:
      "Supports d'exposition professionnels pour salons, conférences et points de vente. Structure aluminium légère incluse.",
    icon: AlignJustify,
    gradient: 'linear-gradient(135deg, #1B4F72 0%, #2471A3 100%)',
    options: ['85cm', '100cm', 'Impression seule', 'Structure seule', 'Avec sac transport'],
    faq: PRODUCTS_FAQ.kakemonos.faq,
  },
}

const HOW_TO = [
  { icon: MousePointer, num: '1', title: 'Choisissez votre produit', desc: 'Sélectionnez le format et les options adaptés à votre besoin' },
  { icon: Upload,       num: '2', title: 'Envoyez votre fichier',    desc: 'Par WhatsApp, email ou formulaire de devis en ligne' },
  { icon: PackageCheck, num: '3', title: 'Récupérez votre commande', desc: 'Livraison à Conakry ou retrait sur place à notre atelier' },
]

function VarianteSkeleton() {
  return (
    <div className="rounded-2xl border border-jp-gray p-6 animate-pulse space-y-3">
      <div className="h-5 bg-jp-gray rounded w-2/3" />
      <div className="h-3 bg-jp-gray rounded w-full" />
      <div className="h-3 bg-jp-gray rounded w-3/4" />
      <div className="h-8 bg-jp-gray rounded w-1/2 mt-4" />
      <div className="h-10 bg-jp-gray rounded-full mt-4" />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Composant
───────────────────────────────────────────── */
export default function ProductPage({ product }) {
  const [openFaq, setOpenFaq] = useState(null)
  const [variantes, setVariantes] = useState([])
  const [loadingVariantes, setLoadingVariantes] = useState(true)
  const { afficher_prix } = useParametresSite()
  const showPrices = afficher_prix !== 'false'

  const data = CATALOG[product]

  useEffect(() => {
    if (!product) return
    setLoadingVariantes(true)
    getVariantesBySlug(product)
      .then(setVariantes)
      .catch(() => setVariantes([]))
      .finally(() => setLoadingVariantes(false))
  }, [product])

  if (!data) return null
  const Icon = data.icon

  function toggleFaq(i) {
    setOpenFaq(prev => (prev === i ? null : i))
  }

  const colsClass =
    variantes.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
    variantes.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
    'grid-cols-1 md:grid-cols-3'

  return (
    <main>
      {/* ── A — HERO ── */}
      <section className="py-16" style={{ background: data.gradient }}>
        <div className="max-w-7xl mx-auto px-4 text-white">
          <nav className="flex items-center gap-1.5 text-white/60 text-sm font-nunito mb-6" aria-label="Fil d'Ariane">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span>Nos produits</span>
            <ChevronRight size={14} />
            <span className="text-white font-semibold">{data.nom}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
                  <Icon size={34} className="text-white" />
                </div>
                <div>
                  <h1 className="font-roboto font-bold text-3xl md:text-5xl leading-tight">{data.nom}</h1>
                  <p className="font-nunito text-jp-cyan font-semibold text-lg mt-1">{data.tagline}</p>
                </div>
              </div>
              <p className="font-nunito text-white/80 text-base max-w-xl leading-relaxed">{data.description}</p>
            </div>

            <Link
              to="/devis"
              className="inline-flex items-center justify-center bg-jp-cyan text-white font-nunito font-bold rounded-full px-8 py-3.5 hover:bg-white hover:text-jp-blue transition-colors self-start md:self-center shrink-0"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* ── B — VARIANTES ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-roboto font-bold text-2xl md:text-3xl text-jp-graphite mb-2">
              Choisissez votre formule
            </h2>
            <p className="font-nunito text-jp-gray2 text-sm">
              {showPrices
                ? 'Tous nos prix sont en Francs Guinéens (GNF) TTC'
                : 'Tarifs personnalisés selon vos besoins — demandez votre devis gratuit'}
            </p>
          </div>

          {loadingVariantes ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <VarianteSkeleton key={i} />)}
            </div>
          ) : variantes.length === 0 ? (
            <div className="text-center py-12 font-nunito text-jp-gray2">
              <p className="mb-4">Tarifs en cours de mise à jour.</p>
              <Link to="/devis" className="inline-block bg-jp-blue text-white font-bold rounded-full px-8 py-3 hover:bg-jp-blue2 transition-colors">
                Demander un devis
              </Link>
            </div>
          ) : (
            <div className={`grid ${colsClass} gap-6 items-stretch`}>
              {variantes.map((v) => {
                const isPopulaire = v.populaire
                return (
                  <div
                    key={v.id}
                    className={`relative rounded-2xl p-6 flex flex-col transition-all duration-200 ${
                      isPopulaire
                        ? 'border-2 border-jp-cyan shadow-xl md:scale-[1.03]'
                        : 'border border-jp-gray hover:border-jp-cyan hover:shadow-lg'
                    }`}
                  >
                    {isPopulaire && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-jp-cyan text-white font-nunito font-bold text-xs rounded-full px-4 py-1.5 shadow-md whitespace-nowrap">
                          ★ Populaire
                        </span>
                      </div>
                    )}

                    <h3 className="font-nunito font-black text-jp-graphite text-xl mb-2 mt-2">{v.nom}</h3>
                    <p className="font-nunito text-jp-gray2 text-sm mb-5 flex-1 leading-relaxed">{v.specs}</p>

                    <div className="mb-1">
                      {showPrices ? (
                        <>
                          <span className="font-nunito font-black text-jp-blue text-4xl">
                            {v.prix.toLocaleString('fr-FR')}
                          </span>
                          <span className="font-nunito text-jp-gray2 text-sm ml-1.5">GNF</span>
                        </>
                      ) : (
                        <span className="font-nunito font-black text-jp-blue text-2xl">Prix sur devis</span>
                      )}
                    </div>
                    {v.unite && <p className="font-nunito text-jp-gray2 text-xs mb-2">{v.unite}</p>}

                    {v.delai && (
                      <div className="flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                        <span className="font-nunito text-jp-gray2 text-xs">Délai : {v.delai}</span>
                      </div>
                    )}

                    <Link
                      to="/devis"
                      className={`block text-center font-nunito font-bold rounded-full py-3 transition-colors ${
                        isPopulaire
                          ? 'bg-jp-cyan text-white hover:bg-jp-blue'
                          : 'border-2 border-jp-blue text-jp-blue hover:bg-jp-blue hover:text-white'
                      }`}
                    >
                      Choisir cette formule
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── C — OPTIONS ── */}
      {data.options && data.options.length > 0 && (
        <section className="py-10 bg-white border-t border-jp-gray">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-roboto font-bold text-xl text-jp-graphite mb-5">Options disponibles</h2>
            <div className="flex flex-wrap gap-2.5">
              {data.options.map(opt => (
                <span
                  key={opt}
                  className="bg-jp-cyan-l text-jp-blue font-nunito font-semibold text-sm rounded-full px-4 py-1.5 hover:bg-jp-cyan hover:text-white transition-colors cursor-default"
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── D — COMMENT COMMANDER ── */}
      <section className="py-16 bg-jp-cyan-l">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-roboto font-bold text-2xl md:text-3xl text-jp-graphite text-center mb-14">
            Comment commander ?
          </h2>
          <div className="relative max-w-3xl mx-auto flex flex-col md:flex-row gap-10 md:gap-0">
            <div className="hidden md:block absolute top-8 left-[calc(16.66%+30px)] right-[calc(16.66%+30px)] h-0.5 bg-jp-blue/20" aria-hidden="true" />
            {HOW_TO.map(({ icon: HIcon, num, title, desc }) => (
              <div key={num} className="flex-1 flex flex-col items-center text-center px-4 relative">
                <div className="relative mb-5 z-10">
                  <div className="w-16 h-16 rounded-full bg-jp-blue flex items-center justify-center shadow-lg">
                    <HIcon size={26} className="text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-jp-cyan text-white text-xs font-nunito font-black flex items-center justify-center shadow">
                    {num}
                  </span>
                </div>
                <h3 className="font-nunito font-bold text-jp-graphite mb-2">{title}</h3>
                <p className="font-nunito text-jp-gray2 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── E — FAQ ── */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-roboto font-bold text-2xl md:text-3xl text-jp-graphite text-center mb-10">
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {data.faq.map((item, i) => (
                <div key={i} className="border border-jp-gray rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-jp-cyan-l/50 transition-colors"
                  >
                    <span className="font-nunito font-bold text-jp-graphite pr-4 leading-snug">{item.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-jp-blue2 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-5 pb-5 font-nunito text-jp-gray2 text-sm leading-relaxed">{item.r}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── F — CTA ── */}
      <section className="py-14 bg-jp-blue text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-roboto font-bold text-2xl md:text-3xl mb-3">Prêt à commander ?</h2>
          <p className="font-nunito text-white/80 text-lg mb-8">Obtenez votre devis personnalisé en moins de 2 heures.</p>
          <Link
            to="/devis"
            className="inline-block bg-jp-cyan text-white font-nunito font-bold rounded-full px-10 py-3.5 hover:bg-white hover:text-jp-blue transition-colors text-base"
          >
            Demander mon devis gratuit
          </Link>
        </div>
      </section>
    </main>
  )
}
