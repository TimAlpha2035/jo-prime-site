import { Link } from 'react-router-dom'
import { MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useParametresSite } from '../contexts/ParamsContext'

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const PRODUCTS = [
  { to: '/cartes-de-visite', label: 'Cartes de visite' },
  { to: '/affiches-flyers', label: 'Affiches & Flyers' },
  { to: '/baches-banderoles', label: 'Bâches & Banderoles' },
  { to: '/photocopies', label: 'Photocopies & Impression' },
  { to: '/decoration-stickers', label: 'Décoration & Stickers' },
  { to: '/kakemonos', label: 'Kakémonos & Roll-up' },
]

const INFO_LINKS = [
  { to: '/a-propos', label: 'À propos' },
  { to: '/realisations', label: 'Réalisations' },
  { to: '/devis', label: 'Devis gratuit' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
]

function FooterHeading({ children }) {
  return (
    <h3 className="font-nunito font-bold text-xs uppercase tracking-widest text-jp-cyan mb-4">
      {children}
    </h3>
  )
}

export default function Footer() {
  const { telephone, email, adresse, horaires, whatsapp, facebook, instagram } = useParametresSite()

  return (
    <footer className="bg-jp-graphite text-white">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand */}
          <div>
            <div className="mb-3">
              <span className="font-nunito font-black text-jp-blue text-xl">JO</span>
              <span className="font-nunito font-black text-jp-cyan text-xl">&nbsp;PRIME</span>
              <span className="font-nunito font-semibold text-jp-blue2 text-xl">&nbsp;Print</span>
            </div>
            <p className="font-nunito text-jp-gray2 text-sm italic mb-1">
              "Chaque offre ou service, une signature"
            </p>
            <p className="font-nunito text-jp-gray2 text-sm mb-5">
              Imprimerie professionnelle à Conakry, Guinée
            </p>
            <div className="flex gap-3">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-jp-cyan transition-colors">
                  <IconFacebook />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-jp-cyan transition-colors">
                  <IconInstagram />
                </a>
              )}
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-jp-cyan transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Col 2 — Produits */}
          <div>
            <FooterHeading>Nos produits</FooterHeading>
            <ul className="space-y-2">
              {PRODUCTS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="font-nunito text-jp-gray2 text-sm hover:text-jp-cyan transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Informations */}
          <div>
            <FooterHeading>Informations</FooterHeading>
            <ul className="space-y-2">
              {INFO_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="font-nunito text-jp-gray2 text-sm hover:text-jp-cyan transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <FooterHeading>Contact rapide</FooterHeading>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-jp-cyan shrink-0 mt-0.5" />
                <span className="font-nunito text-jp-gray2 text-sm">{adresse}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-jp-cyan shrink-0" />
                <a href={`tel:${telephone.replace(/\s/g, '')}`}
                  className="font-nunito text-jp-gray2 text-sm hover:text-jp-cyan transition-colors">
                  {telephone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-jp-cyan shrink-0" />
                <a href={`mailto:${email}`}
                  className="font-nunito text-jp-gray2 text-sm hover:text-jp-cyan transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-jp-cyan shrink-0" />
                <span className="font-nunito text-jp-gray2 text-sm">{horaires}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-jp-cyan/20" />

      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        <p className="font-nunito text-jp-gray2 text-sm">
          © 2026 JO Prime Print. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
