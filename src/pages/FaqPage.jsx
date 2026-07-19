import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { PRODUCTS_FAQ, GENERAL_FAQ } from '../data/faqData'

function FaqAccordion({ items, prefix }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const key = `${prefix}-${i}`
        const isOpen = openIndex === key
        return (
          <div key={key} className="border border-jp-gray rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : key)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-jp-cyan-l/50 transition-colors"
            >
              <span className="font-nunito font-bold text-jp-graphite pr-4 leading-snug">{item.q}</span>
              <ChevronDown
                size={20}
                className={`text-jp-blue2 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="px-5 pb-5 font-nunito text-jp-gray2 text-sm leading-relaxed">{item.r}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function FaqPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, #1B4F72 0%, #2471A3 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-white text-center">
          <h1 className="font-roboto font-bold text-3xl md:text-5xl mb-3">Questions fréquentes</h1>
          <p className="font-nunito text-white/80 text-lg">Tout ce qu'il faut savoir avant de commander</p>
        </div>
      </section>

      {/* FAQ générale */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-roboto font-bold text-2xl text-jp-graphite mb-6">Questions générales</h2>
          <FaqAccordion items={GENERAL_FAQ} prefix="general" />
        </div>
      </section>

      {/* FAQ par produit */}
      <section className="py-4 pb-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-12">
          {Object.entries(PRODUCTS_FAQ).map(([slug, { nom, to, faq }]) => (
            <div key={slug}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-roboto font-bold text-2xl text-jp-graphite">{nom}</h2>
                <Link to={to} className="font-nunito font-semibold text-jp-blue2 text-sm hover:underline whitespace-nowrap ml-4">
                  Voir la page →
                </Link>
              </div>
              <FaqAccordion items={faq} prefix={slug} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-jp-cyan-l text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-roboto font-bold text-2xl md:text-3xl text-jp-graphite mb-3">
            Une autre question ?
          </h2>
          <p className="font-nunito text-jp-gray2 text-lg mb-8">Notre équipe vous répond directement.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-block bg-jp-blue text-white font-nunito font-bold rounded-full px-8 py-3 hover:bg-jp-blue2 transition-colors"
            >
              Nous contacter
            </Link>
            <Link
              to="/devis"
              className="inline-block border-2 border-jp-blue text-jp-blue font-nunito font-bold rounded-full px-8 py-3 hover:bg-jp-blue hover:text-white transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
