import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle } from 'lucide-react'
import { useParametresSite } from '../contexts/ParamsContext'
import { addMessageContact } from '../hooks/useSupabaseSite'
import { sendContactEmail } from '../lib/notify'

const INITIAL = { nom: '', email: '', sujet: '', message: '' }
const INPUT_CLS = 'w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-cyan transition-colors'

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { telephone, email, adresse, horaires, whatsapp } = useParametresSite()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      // 1. Enregistrer dans Supabase
      await addMessageContact({
        nom: form.nom,
        email: form.email,
        sujet: form.sujet,
        message: form.message,
        statut: 'nouveau',
      })

      // 2. Notifier par email (ne bloque pas la soumission en cas d'échec)
      sendContactEmail({
        nom: form.nom,
        email: form.email,
        sujet: form.sujet,
        message: form.message,
      }).catch(err => console.warn('Notification email:', err))

      setSuccess(true)
    } catch (err) {
      console.error('Erreur soumission contact:', err)
      setError("Une erreur est survenue. Contactez-nous directement sur WhatsApp.")
    } finally {
      setSubmitting(false)
    }
  }

  const INFOS = [
    { icon: MapPin, label: 'Adresse',   content: adresse,   href: null },
    { icon: Phone,  label: 'Téléphone', content: telephone, href: `tel:${telephone.replace(/\s/g, '')}` },
    { icon: Mail,   label: 'Email',     content: email,     href: `mailto:${email}` },
    { icon: Clock,  label: 'Horaires',  content: horaires,  href: null },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, #1B4F72 0%, #2471A3 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-white text-center">
          <h1 className="font-roboto font-bold text-3xl md:text-5xl mb-3">Contactez-nous</h1>
          <p className="font-nunito text-white/80 text-lg">Notre équipe est disponible du lundi au samedi, de 8h à 18h.</p>
        </div>
      </section>

      <section className="py-16 bg-jp-cyan-l">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── Formulaire ── */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="font-nunito font-bold text-xl text-jp-graphite mb-6">Envoyez-nous un message</h2>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-jp-cyan/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-jp-cyan" />
                  </div>
                  <h3 className="font-nunito font-bold text-jp-graphite text-lg mb-2">Message envoyé !</h3>
                  <p className="font-nunito text-jp-gray2 text-sm mb-6 leading-relaxed">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button onClick={() => { setSuccess(false); setForm(INITIAL) }}
                    className="bg-jp-blue text-white font-nunito font-semibold rounded-full px-7 py-2.5 hover:bg-jp-blue2 transition-colors">
                    Nouveau message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1 block">
                      Nom complet <span className="text-jp-blue2">*</span>
                    </label>
                    <input name="nom" required value={form.nom} onChange={handleChange}
                      className={INPUT_CLS} placeholder="Votre nom complet" />
                  </div>

                  <div>
                    <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1 block">
                      Email <span className="text-jp-blue2">*</span>
                    </label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange}
                      className={INPUT_CLS} placeholder="votre@email.com" />
                  </div>

                  <div>
                    <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1 block">
                      Sujet <span className="text-jp-blue2">*</span>
                    </label>
                    <input name="sujet" required value={form.sujet} onChange={handleChange}
                      className={INPUT_CLS} placeholder="Objet de votre message" />
                  </div>

                  <div>
                    <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1 block">
                      Message <span className="text-jp-blue2">*</span>
                    </label>
                    <textarea name="message" required rows={5} value={form.message} onChange={handleChange}
                      className={INPUT_CLS + ' resize-none'} placeholder="Votre message…" />
                  </div>

                  {error && (
                    <p className="font-nunito text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>
                  )}

                  <button type="submit" disabled={submitting}
                    className="w-full bg-jp-blue text-white font-nunito font-bold rounded-xl py-3 hover:bg-jp-blue2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? 'Envoi en cours…' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>

            {/* ── Infos + Carte ── */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-nunito font-bold text-jp-graphite mb-5">Nos coordonnées</h3>
                <ul className="space-y-4">
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
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 bg-green-500 text-white font-nunito font-semibold rounded-full py-3 hover:bg-green-600 transition-colors">
                  <MessageCircle size={20} />
                  Écrire sur WhatsApp
                </a>
              </div>

              <div className="bg-jp-cyan-l rounded-2xl h-56 flex flex-col items-center justify-center shadow-sm border border-jp-gray">
                <MapPin size={32} className="text-jp-blue mb-2" />
                <p className="font-nunito font-semibold text-jp-graphite">Carte — {adresse}</p>
                <p className="font-nunito text-jp-gray2 text-sm mt-1">Intégration Google Maps à venir</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
