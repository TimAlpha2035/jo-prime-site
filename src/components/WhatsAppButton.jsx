import { useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useParametresSite } from '../contexts/ParamsContext'

const WA_TEXT = encodeURIComponent('Bonjour JO Prime Print, je souhaite un devis pour...')

const PRODUCT_ROUTES = [
  '/cartes-de-visite', '/affiches-flyers', '/baches-banderoles',
  '/photocopies', '/decoration-stickers', '/kakemonos',
]

export default function WhatsAppButton() {
  const { pathname } = useLocation()
  const { whatsapp } = useParametresSite()

  if (pathname === '/devis') return null

  // Sur les pages produit, les cartes de tarifs occupent toute la largeur
  // en mobile : on remonte le bouton pour ne pas chevaucher leur contenu.
  const isProductPage = PRODUCT_ROUTES.includes(pathname)

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${WA_TEXT}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
      className={`group fixed right-6 z-50 flex items-center justify-center w-[60px] h-[60px] ${
        isProductPage ? 'bottom-32 md:bottom-6' : 'bottom-6'
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50" aria-hidden="true" />
      <span className="relative w-[60px] h-[60px] rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center shadow-lg shadow-green-500/40">
        <MessageCircle size={28} className="text-white" />
      </span>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-jp-graphite text-white font-nunito font-semibold text-sm rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl">
        Discuter sur WhatsApp
        <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-jp-graphite" aria-hidden="true" />
      </span>
    </a>
  )
}
