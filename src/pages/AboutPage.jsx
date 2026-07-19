import { Link } from 'react-router-dom'
import {
  Award, Clock, Users, Headphones,
  FileText, BadgeCheck, Truck,
  MapPin, Phone, Mail, Clock as ClockIcon,
} from 'lucide-react'
import { useParametresSite } from '../contexts/ParamsContext'

const VALEURS = [
  { icon: Award, title: 'Qualité certifiée', desc: 'Nos impressions respectent les standards internationaux de qualité' },
  { icon: Clock, title: 'Délais respectés', desc: 'Express 24h disponible, délais garantis contractuellement' },
  { icon: Users, title: 'Équipe experte', desc: 'Graphistes et techniciens qualifiés à votre service' },
  { icon: Headphones, title: 'Support réactif', desc: 'Disponible 6j/7 pour répondre à vos questions' },
]

const ENGAGEMENTS = [
  { icon: FileText, title: 'Fichier prêt à imprimer', desc: "Envoyez-nous votre fichier PDF, image ou faites appel à nos graphistes pour la conception" },
  { icon: BadgeCheck, title: 'Validation avant impression', desc: "Nous vérifions votre fichier et vous envoyons un bon à tirer avant tout lancement en impression" },
  { icon: Truck, title: 'Livraison ou retrait', desc: "Récupérez votre commande en boutique ou faites-vous livrer à Conakry et partout en Guinée" },
]

const PRODUITS = [
  'Cartes de visite', 'Affiches & Flyers', 'Bâches & Banderoles',
  'Photocopies & Impression', 'Décoration & Stickers', 'Kakémonos & Roll-up',
]

export default function AboutPage() {
  const { telephone, email, adresse, horaires } = useParametresSite()

  const INFOS = [
    { icon: MapPin, label: 'Adresse', content: adresse },
    { icon: Phone, label: 'Téléphone', content: telephone, href: `tel:${telephone.replace(/\s/g, '')}` },
    { icon: Mail, label: 'Email', content: email, href: `mailto:${email}` },
    { icon: ClockIcon, label: 'Horaires', content: horaires },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #1B4F72 0%, #2471A3 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-white text-center">
          <h1 className="font-roboto font-bold text-3xl md:text-5xl mb-3">À propos de JO Prime Print</h1>
          <p className="font-nunito text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            "Chaque offre ou service, une signature" — imprimerie professionnelle à Conakry, Guinée
          </p>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-roboto font-bold text-2xl md:text-3xl text-jp-graphite mb-5">Qui sommes-nous ?</h2>
          <p className="font-nunito text-jp-gray2 leading-relaxed mb-4">
            JO Prime Print est une imprimerie professionnelle basée à Conakry, au service des particuliers,
            entreprises et institutions partout en Guinée. Nous accompagnons chaque client, de la conception
            graphique jusqu'à la livraison, sur une gamme complète de supports imprimés.
          </p>
          <p className="font-nunito text-jp-gray2 leading-relaxed mb-8">
            Notre engagement : un devis clair et rapide, un bon à tirer validé avant chaque impression, et un
            travail fini qui reflète le sérieux de votre image de marque.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-4">
            {PRODUITS.map(p => (
              <span key={p} className="bg-jp-cyan-l text-jp-blue font-nunito font-semibold text-sm rounded-full px-4 py-1.5">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-jp-cyan-l">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-roboto font-bold text-3xl md:text-4xl text-jp-graphite">
              Pourquoi choisir JO Prime Print ?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {VALEURS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 rounded-xl bg-jp-cyan-l flex items-center justify-center shrink-0">
                  <Icon size={24} className="text-jp-blue" />
                </div>
                <div>
                  <h3 className="font-nunito font-bold text-jp-graphite mb-1">{title}</h3>
                  <p className="font-nunito text-jp-gray2 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-nunito font-bold text-jp-blue2 text-sm uppercase tracking-widest">
              Notre processus
            </span>
            <h2 className="font-roboto font-bold text-3xl md:text-4xl text-jp-graphite mt-2">
              Nos engagements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {ENGAGEMENTS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-jp-cyan-l flex items-center justify-center">
                    <Icon size={30} className="text-jp-blue" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-jp-cyan text-white font-nunito font-black text-xs flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-nunito font-bold text-jp-graphite text-lg mb-3">{title}</h3>
                <p className="font-nunito text-jp-gray2 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coordonnées */}
      <section className="py-16 bg-jp-cyan-l">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="font-nunito font-bold text-xl text-jp-graphite mb-6">Nous trouver</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {INFOS.map(({ icon: Icon, label, content, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon size={18} className="text-jp-blue2 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-nunito font-semibold text-jp-graphite text-sm">{label}</p>
                    {href ? (
                      <a href={href} className="font-nunito text-jp-gray2 text-sm hover:text-jp-cyan transition-colors">{content}</a>
                    ) : (
                      <p className="font-nunito text-jp-gray2 text-sm">{content}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-jp-blue text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-roboto font-bold text-2xl md:text-3xl mb-3">Prêt à démarrer votre projet ?</h2>
          <p className="font-nunito text-white/80 text-lg mb-8">Obtenez votre devis gratuit en moins de 2 heures.</p>
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
