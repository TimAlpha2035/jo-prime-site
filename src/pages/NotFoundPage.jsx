import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <main
      className="min-h-[75vh] flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1B4F72 0%, #1C2833 100%)' }}
    >
      <div className="text-center text-white px-4">
        {/* Grand 404 décoratif */}
        <p
          className="font-roboto font-black leading-none text-jp-cyan select-none"
          style={{ fontSize: 'clamp(120px, 20vw, 200px)', opacity: 0.15 }}
          aria-hidden="true"
        >
          404
        </p>

        <div className="-mt-8 md:-mt-14">
          <h1 className="font-roboto font-bold text-3xl md:text-5xl mb-4">
            Page non trouvée
          </h1>
          <p className="font-nunito text-white/70 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-jp-cyan text-white font-nunito font-bold rounded-full px-8 py-3.5 hover:bg-white hover:text-jp-blue transition-colors"
            >
              <ArrowLeft size={20} />
              Retour à l'accueil
            </Link>
            <Link
              to="/devis"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-nunito font-semibold rounded-full px-8 py-3.5 hover:bg-white hover:text-jp-blue transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
