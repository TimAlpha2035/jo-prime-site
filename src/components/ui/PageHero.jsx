import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/**
 * Props :
 *  - title      : string (obligatoire)
 *  - subtitle   : string (optionnel)
 *  - gradient   : string CSS gradient (optionnel)
 *  - breadcrumbs: [{ label, to? }] (optionnel)
 */
export default function PageHero({
  title,
  subtitle,
  gradient = 'linear-gradient(135deg, #1B4F72 0%, #2471A3 100%)',
  breadcrumbs,
}) {
  return (
    <section
      className="flex flex-col items-center justify-center min-h-[150px] md:min-h-[200px] py-10 md:py-14"
      style={{ background: gradient }}
    >
      <div className="max-w-7xl w-full mx-auto px-4 text-white text-center">
        {/* Breadcrumb optionnel */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className="flex items-center justify-center gap-1.5 text-white/60 text-sm font-nunito mb-3"
            aria-label="Fil d'Ariane"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} />}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="font-roboto font-bold text-2xl md:text-4xl mb-2">{title}</h1>

        {subtitle && (
          <p className="font-nunito text-white/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
