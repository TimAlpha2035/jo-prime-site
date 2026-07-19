import { useState } from 'react'
import { Clock, Phone, Shield, Mail, CheckCircle } from 'lucide-react'
import { useParametresSite } from '../contexts/ParamsContext'
import { addDemandeDevis } from '../hooks/useSupabaseSite'
import { sendDevisEmail } from '../lib/notify'

const WA_TEXT = encodeURIComponent('Bonjour JO Prime Print, je souhaite un devis pour...')

const SERVICES = [
  'Cartes de visite',
  'Affiches & Flyers',
  'Bâches & Banderoles',
  'Photocopies & Impression',
  'Décoration & Stickers',
  'Kakémonos & Roll-up',
]

const INITIAL = {
  prenom: '', nom: '', email: '', telephone: '', entreprise: '',
  service: '', quantite: '', format: '', delai: '', description: '',
}

function Label({ children, htmlFor, optional }) {
  return (
    <label htmlFor={htmlFor} className="font-nunito text-sm font-semibold text-jp-graphite mb-1 block">
      {children}{' '}
      {optional ? <span className="text-jp-gray2 font-normal">(optionnel)</span> : <span className="text-jp-blue2">*</span>}
    </label>
  )
}

const INPUT_CLS = 'w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-cyan transition-colors'
const SELECT_CLS = INPUT_CLS + ' bg-white'

export default function DevisPage() {
  const [form, setForm] = useState(INITIAL)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { whatsapp, telephone, email, horaires } = useParametresSite()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      // 1. Enregistrer dans Supabase
      await addDemandeDevis({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        entreprise: form.entreprise,
        service: form.service,
        quantite: form.quantite,
        format: form.format,
        delai: form.delai,
        description: form.description,
        statut: 'nouveau',
      })

      // 2. Notifier par email (ne bloque pas la soumission en cas d'échec)
      sendDevisEmail({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        entreprise: form.entreprise || '—',
        service: form.service,
        quantite: form.quantite,
        format: form.format || '—',
        delai: form.delai,
        description: form.description,
      }).catch(err => console.warn('Notification email:', err))

      setSuccess(true)
    } catch (err) {
      console.error('Erreur soumission devis:', err)
      setError("Une erreur est survenue. Veuillez nous contacter directement sur WhatsApp.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-jp-cyan-l px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-jp-cyan/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-jp-cyan" />
          </div>
          <h2 className="font-roboto font-bold text-2xl text-jp-graphite mb-2">Demande envoyée !</h2>
          <p className="font-nunito text-jp-gray2 mb-8 leading-relaxed">
            Merci <span className="font-semibold text-jp-graphite">{form.prenom}</span> ! Nous vous répondrons
            dans les 2 heures avec votre devis personnalisé.
          </p>
          <button
            onClick={() => { setSuccess(false); setForm(INITIAL) }}
            className="bg-jp-blue text-white font-nunito font-semibold rounded-full px-7 py-2.5 hover:bg-jp-blue2 transition-colors"
          >
            Nouveau devis
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>
      {/* Hero */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, #1B4F72 0%, #2471A3 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-white text-center">
          <h1 className="font-roboto font-bold text-3xl md:text-5xl mb-3">Demandez votre devis gratuit</h1>
          <p className="font-nunito text-white/80 text-lg">Réponse garantie en moins de 2 heures ouvrées</p>
        </div>
      </section>

      <section className="py-16 bg-jp-cyan-l">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── Formulaire ── */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <h2 className="font-nunito font-bold text-xl text-jp-graphite">Vos informations</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom">Prénom</Label>
                    <input id="prenom" name="prenom" required value={form.prenom} onChange={handleChange}
                      className={INPUT_CLS} placeholder="Votre prénom" />
                  </div>
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <input id="nom" name="nom" required value={form.nom} onChange={handleChange}
                      className={INPUT_CLS} placeholder="Votre nom" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                    className={INPUT_CLS} placeholder="votre@email.com" />
                </div>

                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <div className="flex">
                    <span className="border border-r-0 border-jp-gray rounded-l-lg px-3 flex items-center bg-jp-cyan-l font-nunito text-sm text-jp-gray2 shrink-0">
                      +224
                    </span>
                    <input id="telephone" name="telephone" type="tel" required value={form.telephone} onChange={handleChange}
                      className="flex-1 border border-jp-gray rounded-r-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-cyan transition-colors"
                      placeholder="XXX XXX XXX" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="entreprise" optional>Entreprise</Label>
                  <input id="entreprise" name="entreprise" value={form.entreprise} onChange={handleChange}
                    className={INPUT_CLS} placeholder="Nom de votre entreprise" />
                </div>

                <hr className="border-jp-gray" />
                <h2 className="font-nunito font-bold text-xl text-jp-graphite">Votre projet</h2>

                <div>
                  <Label htmlFor="service">Type de produit</Label>
                  <select id="service" name="service" required value={form.service} onChange={handleChange} className={SELECT_CLS}>
                    <option value="">Sélectionnez un produit</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <Label htmlFor="quantite">Quantité souhaitée</Label>
                  <input id="quantite" name="quantite" required value={form.quantite} onChange={handleChange}
                    className={INPUT_CLS} placeholder="Ex : 500 exemplaires" />
                </div>

                <div>
                  <Label htmlFor="format" optional>Format / Dimensions</Label>
                  <input id="format" name="format" value={form.format} onChange={handleChange}
                    className={INPUT_CLS} placeholder="Ex : A4, 85×55 mm, 2×1 m…" />
                </div>

                <div>
                  <Label htmlFor="delai">Délai souhaité</Label>
                  <select id="delai" name="delai" required value={form.delai} onChange={handleChange} className={SELECT_CLS}>
                    <option value="">Choisissez un délai</option>
                    <option value="urgent">Urgent — 24h</option>
                    <option value="3jours">3 jours</option>
                    <option value="1semaine">1 semaine</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Décrivez votre projet</Label>
                  <textarea id="description" name="description" required rows={4} value={form.description} onChange={handleChange}
                    className={INPUT_CLS + ' resize-none'}
                    placeholder="Décrivez votre projet, vos besoins, vos préférences de couleurs, finitions…" />
                </div>

                {error && (
                  <p className="font-nunito text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full bg-jp-blue text-white font-nunito font-bold rounded-xl py-4 hover:bg-jp-blue2 transition-colors text-base disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Envoi en cours…' : 'Envoyer ma demande de devis'}
                </button>
              </form>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-4">
              {[
                { icon: Clock,  title: 'Réponse en 2h',     desc: 'Nous vous répondons avec votre devis sous 2 heures ouvrées.' },
                { icon: Phone,  title: 'Rappel gratuit',     desc: 'Vous préférez être rappelé ? Indiquez votre numéro.' },
                { icon: Shield, title: 'Sans engagement',    desc: 'Votre devis est entièrement gratuit et sans aucun engagement.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-5 flex gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-jp-cyan/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-jp-blue2" />
                  </div>
                  <div>
                    <h3 className="font-nunito font-bold text-jp-graphite text-sm mb-1">{title}</h3>
                    <p className="font-nunito text-jp-gray2 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

              {/* Bloc contact direct */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-jp-gray">
                <h3 className="font-nunito font-bold text-jp-graphite mb-4">Ou contactez-nous directement</h3>

                <a href={`https://wa.me/${whatsapp}?text=${WA_TEXT}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-nunito font-bold rounded-xl py-3.5 hover:bg-green-600 transition-colors mb-4 text-sm">
                  💬 Envoyer sur WhatsApp
                </a>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-jp-gray" />
                  <span className="font-nunito text-jp-gray2 text-xs font-bold tracking-widest">OU</span>
                  <div className="flex-1 h-px bg-jp-gray" />
                </div>

                <ul className="space-y-3">
                  <li>
                    <a href={`tel:${telephone.replace(/\s/g, '')}`} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-jp-cyan-l flex items-center justify-center shrink-0">
                        <Phone size={16} className="text-jp-blue2" />
                      </div>
                      <div>
                        <p className="font-nunito text-jp-gray2 text-xs">Téléphone</p>
                        <p className="font-nunito font-semibold text-jp-graphite text-sm group-hover:text-jp-cyan transition-colors">{telephone}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-jp-cyan-l flex items-center justify-center shrink-0">
                        <Mail size={16} className="text-jp-blue2" />
                      </div>
                      <div>
                        <p className="font-nunito text-jp-gray2 text-xs">Email</p>
                        <p className="font-nunito font-semibold text-jp-graphite text-sm group-hover:text-jp-cyan transition-colors">{email}</p>
                      </div>
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-jp-cyan-l flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-jp-blue2" />
                    </div>
                    <div>
                      <p className="font-nunito text-jp-gray2 text-xs">Horaires</p>
                      <p className="font-nunito font-semibold text-jp-graphite text-sm">{horaires}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
