import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useParametresSite } from '../contexts/ParamsContext'
import {
  CreditCard, FileImage, Flag, Copy, Layers, AlignJustify,
  Truck, Star, DollarSign, Phone, MessageSquare, FileCheck, PackageCheck,
  Award, Clock, Users, Headphones, CheckCircle, MessageCircle,
  FileText, BadgeCheck,
} from 'lucide-react'

const PRODUCTS = [
  {
    to: '/cartes-de-visite',
    icon: CreditCard,
    title: 'Cartes de visite',
    desc: 'Cartes standard, coins arrondis, premium',
    price: 'À partir de 50 000 GNF',
    image: '/images/produits/cartes-de-visite.jpg',
    bg: 'bg-jp-blue',
  },
  {
    to: '/affiches-flyers',
    icon: FileImage,
    title: 'Affiches & Flyers',
    desc: 'Formats A4 à A0, papier couché qualité',
    price: 'À partir de 5 000 GNF',
    image: '/images/produits/affiches-flyers.jpg',
    bg: 'bg-jp-blue2',
  },
  {
    to: '/baches-banderoles',
    icon: Flag,
    title: 'Bâches & Banderoles',
    desc: 'Intérieur, extérieur, avec œillets',
    price: 'À partir de 80 000 GNF/m²',
    image: '/images/produits/baches-banderoles.jpg',
    bg: 'bg-jp-graphite',
  },
  {
    to: '/photocopies',
    icon: Copy,
    title: 'Photocopies & Impression',
    desc: 'Noir & blanc et couleur, reliure possible',
    price: 'À partir de 500 GNF/page',
    image: '/images/produits/photocopies.jpg',
    bg: 'bg-jp-blue',
  },
  {
    to: '/decoration-stickers',
    icon: Layers,
    title: 'Décoration & Stickers',
    desc: 'Adhésifs, vitrophanie, panneaux rigides',
    price: 'À partir de 30 000 GNF',
    image: '/images/produits/decoration-stickers.jpg',
    bg: 'bg-jp-blue2',
  },
  {
    to: '/kakemonos',
    icon: AlignJustify,
    title: 'Kakémonos & Roll-up',
    desc: '85×200 cm et 100×200 cm avec structure',
    price: 'À partir de 350 000 GNF',
    image: '/images/produits/kakemonos.jpg',
    imagePosition: 'top',
    bg: 'bg-jp-graphite',
  },
]

const ADVANTAGES = [
  { icon: Truck, title: 'Livraison rapide', desc: 'Conakry et toute la Guinée' },
  { icon: Star, title: 'Qualité premium', desc: 'Matériaux professionnels' },
  { icon: DollarSign, title: 'Prix compétitifs', desc: 'Meilleur rapport qualité/prix' },
  { icon: Phone, title: 'Accompagnement', desc: 'Conseil personnalisé' },
]

const STEPS = [
  {
    num: '1',
    icon: MessageSquare,
    title: 'Contactez-nous',
    desc: 'Décrivez votre projet par WhatsApp, téléphone ou formulaire',
    bg: 'bg-jp-cyan',
  },
  {
    num: '2',
    icon: FileCheck,
    title: 'Recevez votre devis',
    desc: 'Nous vous envoyons un devis détaillé sous 2 heures',
    bg: 'bg-jp-blue',
  },
  {
    num: '3',
    icon: PackageCheck,
    title: 'Récupérez votre commande',
    desc: 'Venez chercher ou recevez votre commande livrée',
    bg: 'bg-jp-cyan',
  },
]

const WHY_US = [
  {
    icon: Award,
    title: 'Qualité certifiée',
    desc: 'Nos impressions respectent les standards internationaux de qualité',
  },
  {
    icon: Clock,
    title: 'Délais respectés',
    desc: 'Express 24h disponible, délais garantis contractuellement',
  },
  {
    icon: Users,
    title: 'Équipe experte',
    desc: 'Graphistes et techniciens qualifiés à votre service',
  },
  {
    icon: Headphones,
    title: 'Support réactif',
    desc: 'Disponible 6j/7 pour répondre à vos questions',
  },
]

const STATS = [
  { end: 500, suffix: '+', label: 'clients satisfaits' },
  { end: 10, suffix: '+', label: "années d'expérience" },
  { end: 24, suffix: 'h', label: 'délai express' },
]

const ENGAGEMENTS = [
  {
    icon: FileText,
    title: 'Fichier prêt à imprimer',
    desc: "Envoyez-nous votre fichier PDF, image ou faites appel à nos graphistes pour la conception",
  },
  {
    icon: BadgeCheck,
    title: 'Validation avant impression',
    desc: "Nous vérifions votre fichier et vous envoyons un bon à tirer avant tout lancement en impression",
  },
  {
    icon: Truck,
    title: 'Livraison ou retrait',
    desc: "Récupérez votre commande en boutique ou faites-vous livrer à Conakry et partout en Guinée",
  },
]

const TESTIMONIALS = [
  {
    text: 'Service impeccable, nos cartes de visite ont été livrées en 24h !',
    name: 'Mamadou Diallo',
    company: 'Directeur Commercial',
    initials: 'MD',
    avatarBg: 'bg-jp-blue',
  },
  {
    text: "La qualité de nos bâches événementielles était excellente. Je recommande !",
    name: 'Fatoumata Camara',
    company: 'Responsable Marketing',
    initials: 'FC',
    avatarBg: 'bg-jp-cyan',
  },
  {
    text: 'Devis rapide, prix correct et impression parfaite pour notre salon professionnel.',
    name: 'Ibrahim Bah',
    company: 'Gérant PME',
    initials: 'IB',
    avatarBg: 'bg-jp-blue2',
  },
]

function AnimatedCounter({ end, suffix, label }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const FRAMES = 80
    const INTERVAL = 2000 / FRAMES
    const STEP = end / FRAMES
    let current = 0

    const timer = setInterval(() => {
      current += STEP
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.round(current))
      }
    }, INTERVAL)

    return () => clearInterval(timer)
  }, [end])

  return (
    <div className="text-center">
      <p className="font-nunito font-black text-3xl text-jp-cyan">
        {count}{suffix}
      </p>
      <p className="font-nunito text-white/70 text-xs mt-1">{label}</p>
    </div>
  )
}

export default function HomePage() {
  const { afficher_prix, telephone, whatsapp } = useParametresSite()
  const showPrices = afficher_prix !== 'false'

  return (
    <main>
      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B4F72 0%, #2471A3 100%)' }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28 text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-jp-cyan/20 border border-jp-cyan/40 text-jp-cyan rounded-full px-4 py-1.5 text-sm font-nunito font-semibold mb-6">
            <CheckCircle size={15} />
            Imprimerie professionnelle en Guinée
          </div>

          <h1 className="font-roboto font-bold text-4xl md:text-6xl leading-tight mb-5 max-w-2xl">
            Donnez vie à vos<br />
            <span className="text-jp-cyan">idées</span> avec JO Prime Print
          </h1>

          <p className="font-nunito text-lg md:text-xl text-white/80 max-w-xl mb-8 leading-relaxed">
            Cartes de visite, affiches, bâches, décorations…<br />
            Livraison rapide à Conakry et partout en Guinée.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <a
              href="#produits"
              className="bg-jp-cyan text-white font-nunito font-semibold rounded-full px-8 py-3 hover:bg-white hover:text-jp-blue transition-colors"
            >
              Voir nos produits
            </a>
            <Link
              to="/devis"
              className="border-2 border-white text-white font-nunito font-semibold rounded-full px-8 py-3 hover:bg-white hover:text-jp-blue transition-colors"
            >
              Demander un devis
            </Link>
          </div>

          {/* Stats animées */}
          <div className="grid grid-cols-3 gap-6 max-w-sm">
            {STATS.map(stat => (
              <AnimatedCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* Decorative "JO" */}
        <div
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 select-none pointer-events-none"
          aria-hidden="true"
        >
          <span
            className="font-nunito font-black text-jp-cyan"
            style={{ fontSize: '260px', lineHeight: 1, opacity: 0.07 }}
          >
            JO
          </span>
        </div>
      </section>

      {/* ─── PRODUITS ─── */}
      <section id="produits" className="py-16 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-nunito font-bold text-jp-blue2 text-sm uppercase tracking-widest">
              Nos produits
            </span>
            <h2 className="font-roboto font-bold text-3xl md:text-4xl text-jp-graphite mt-2">
              Tout ce dont vous avez besoin
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map(({ to, icon: Icon, title, desc, price, image, imagePosition, bg }) => (
              <Link
                key={to}
                to={to}
                className="group border border-jp-gray rounded-2xl overflow-hidden flex flex-col hover:border-jp-cyan hover:shadow-lg transition-all duration-200"
              >
                <div className="h-40 overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      style={{ objectPosition: imagePosition || 'center' }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`${bg} h-full flex items-center justify-center`}>
                      <Icon size={48} className="text-white/70 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-nunito font-bold text-lg text-jp-graphite mb-2">{title}</h3>
                  <p className="font-nunito text-jp-gray2 text-sm mb-4 flex-1">{desc}</p>
                  <p className="font-nunito font-semibold text-jp-blue2 text-sm mb-3">
                    {showPrices ? price : 'Prix sur devis'}
                  </p>
                  <span className="font-nunito font-semibold text-jp-blue2 text-sm group-hover:underline">
                    Découvrir →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BANDEAU AVANTAGES ─── */}
      <section className="bg-jp-blue py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ADVANTAGES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center text-white">
                <div className="w-12 h-12 rounded-full bg-jp-cyan/20 flex items-center justify-center mb-3">
                  <Icon size={22} className="text-jp-cyan" />
                </div>
                <p className="font-nunito font-bold text-sm">{title}</p>
                <p className="font-nunito text-white/60 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-roboto font-bold text-3xl md:text-4xl text-jp-graphite">
              Comment commander ?
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-0">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-6 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-0.5 bg-jp-cyan-l"
              aria-hidden="true"
            />

            {STEPS.map(({ num, icon: Icon, title, desc, bg }) => (
              <div key={num} className="flex-1 flex flex-col items-center text-center px-4 relative">
                <div
                  className={`w-12 h-12 rounded-full ${bg} text-white font-nunito font-black text-xl flex items-center justify-center mb-4 relative z-10 shadow-md`}
                >
                  {num}
                </div>
                <Icon size={28} className="text-jp-blue mb-3" />
                <h3 className="font-nunito font-bold text-jp-graphite mb-2">{title}</h3>
                <p className="font-nunito text-jp-gray2 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/devis"
              className="inline-block bg-jp-blue text-white font-nunito font-semibold rounded-full px-8 py-3 hover:bg-jp-blue2 transition-colors"
            >
              Démarrer mon projet
            </Link>
          </div>
        </div>
      </section>

      {/* ─── POURQUOI NOUS ─── */}
      <section className="py-16 bg-jp-cyan-l">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-roboto font-bold text-3xl md:text-4xl text-jp-graphite">
              Pourquoi choisir JO Prime Print ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow duration-200"
              >
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

      {/* ─── TÉMOIGNAGES ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-roboto font-bold text-3xl md:text-4xl text-jp-graphite">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ text, name, company, initials, avatarBg }) => (
              <div
                key={name}
                className="bg-white border border-jp-gray border-t-4 border-t-jp-cyan rounded-2xl p-6 shadow-sm"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="font-nunito italic text-jp-graphite text-sm mb-5 leading-relaxed">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${avatarBg} text-white flex items-center justify-center font-nunito font-bold text-sm shrink-0`}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-nunito font-bold text-jp-graphite text-sm">{name}</p>
                    <p className="font-nunito text-jp-gray2 text-xs">{company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NOS ENGAGEMENTS ─── */}
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

      {/* ─── CTA FINAL ─── */}
      <section
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #1B4F72 0%, #1C2833 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="font-roboto font-bold text-3xl md:text-5xl mb-4">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="font-nunito text-white/80 text-lg mb-10">
            Obtenez votre devis gratuit en moins de 2 heures
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              to="/devis"
              className="bg-jp-cyan text-white font-nunito font-semibold rounded-full px-8 py-3 hover:bg-white hover:text-jp-blue transition-colors"
            >
              Demander un devis gratuit
            </Link>
            <a
              href={`tel:${telephone.replace(/\s/g, '')}`}
              className="border-2 border-white text-white font-nunito font-semibold rounded-full px-8 py-3 hover:bg-white hover:text-jp-blue transition-colors"
            >
              Nous appeler
            </a>
          </div>

          <a
            href={`https://wa.me/${whatsapp}`}
            className="inline-flex items-center gap-2 text-jp-cyan font-nunito font-semibold hover:text-white transition-colors"
          >
            <MessageCircle size={20} />
            Chat WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}
