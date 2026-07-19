import { useState, useEffect } from 'react'
import { X, CheckCircle, Clock, AlertCircle, RefreshCw, Mail, Phone, FileText, MessageSquare } from 'lucide-react'
import { getDemandes, updateDemandeStatut, getMessages, updateMessageStatut } from '../hooks/useSupabaseSite'
import { Toast, useToast } from '../components/ui/Toast'

const STATUTS = {
  nouveau:   { label: 'Nouveau',     color: 'bg-orange-100 text-orange-600', icon: AlertCircle },
  en_cours:  { label: 'En cours',    color: 'bg-blue-100 text-blue-600',     icon: Clock },
  traite:    { label: 'Traité',      color: 'bg-green-100 text-green-700',   icon: CheckCircle },
}

function StatutBadge({ statut }) {
  const s = STATUTS[statut] || STATUTS.nouveau
  return (
    <span className={`inline-flex items-center gap-1 font-nunito font-bold text-xs rounded-full px-2.5 py-0.5 ${s.color}`}>
      <s.icon size={10} />
      {s.label}
    </span>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

/* ── Modal détail devis ── */
function DevisModal({ item, onClose, onStatut }) {
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-jp-gray shrink-0">
          <div>
            <h2 className="font-nunito font-bold text-jp-graphite">Demande de devis</h2>
            <p className="font-nunito text-jp-gray2 text-xs mt-0.5">{formatDate(item.created_at)}</p>
          </div>
          <button onClick={onClose} className="text-jp-gray2 hover:text-jp-graphite"><X size={22} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4 font-nunito text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-jp-gray2 text-xs mb-0.5">Prénom</p><p className="font-semibold text-jp-graphite">{item.prenom}</p></div>
            <div><p className="text-jp-gray2 text-xs mb-0.5">Nom</p><p className="font-semibold text-jp-graphite">{item.nom}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-jp-gray2 text-xs mb-0.5">Email</p>
              <a href={`mailto:${item.email}`} className="font-semibold text-jp-blue hover:underline">{item.email}</a>
            </div>
            <div>
              <p className="text-jp-gray2 text-xs mb-0.5">Téléphone</p>
              <a href={`tel:${item.telephone}`} className="font-semibold text-jp-blue hover:underline">+224 {item.telephone}</a>
            </div>
          </div>
          {item.entreprise && (
            <div><p className="text-jp-gray2 text-xs mb-0.5">Entreprise</p><p className="font-semibold text-jp-graphite">{item.entreprise}</p></div>
          )}
          <hr className="border-jp-gray" />
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-jp-gray2 text-xs mb-0.5">Service</p><p className="font-semibold text-jp-graphite">{item.service}</p></div>
            <div><p className="text-jp-gray2 text-xs mb-0.5">Quantité</p><p className="font-semibold text-jp-graphite">{item.quantite}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-jp-gray2 text-xs mb-0.5">Format</p><p className="font-semibold text-jp-graphite">{item.format || '—'}</p></div>
            <div><p className="text-jp-gray2 text-xs mb-0.5">Délai</p><p className="font-semibold text-jp-graphite">{item.delai}</p></div>
          </div>
          <div>
            <p className="text-jp-gray2 text-xs mb-1">Description du projet</p>
            <p className="text-jp-graphite bg-jp-cyan-l/30 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-jp-gray2 text-xs">Statut :</p>
            <StatutBadge statut={item.statut} />
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-jp-gray shrink-0 flex-wrap">
          <a href={`mailto:${item.email}?subject=Votre devis JO Prime Print&body=Bonjour ${item.prenom},`}
            className="flex items-center gap-1.5 px-4 py-2 bg-jp-blue text-white font-nunito font-semibold text-sm rounded-xl hover:bg-jp-blue2 transition-colors">
            <Mail size={14} /> Répondre par email
          </a>
          <a href={`https://wa.me/224${item.telephone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white font-nunito font-semibold text-sm rounded-xl hover:bg-green-600 transition-colors">
            <Phone size={14} /> WhatsApp
          </a>
          <div className="flex gap-2 ml-auto">
            {['nouveau', 'en_cours', 'traite'].filter(s => s !== item.statut).map(s => (
              <button key={s} onClick={() => onStatut(item.id, s)}
                className="px-3 py-2 border border-jp-gray text-jp-graphite font-nunito font-semibold text-xs rounded-xl hover:bg-gray-50 transition-colors">
                → {STATUTS[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Modal détail message ── */
function MessageModal({ item, onClose, onStatut }) {
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-jp-gray shrink-0">
          <div>
            <h2 className="font-nunito font-bold text-jp-graphite">{item.sujet}</h2>
            <p className="font-nunito text-jp-gray2 text-xs mt-0.5">{formatDate(item.created_at)}</p>
          </div>
          <button onClick={onClose} className="text-jp-gray2 hover:text-jp-graphite"><X size={22} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4 font-nunito text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-jp-gray2 text-xs mb-0.5">Nom</p><p className="font-semibold text-jp-graphite">{item.nom}</p></div>
            <div>
              <p className="text-jp-gray2 text-xs mb-0.5">Email</p>
              <a href={`mailto:${item.email}`} className="font-semibold text-jp-blue hover:underline">{item.email}</a>
            </div>
          </div>
          <div>
            <p className="text-jp-gray2 text-xs mb-1">Message</p>
            <p className="text-jp-graphite bg-jp-cyan-l/30 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">{item.message}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-jp-gray2 text-xs">Statut :</p>
            <StatutBadge statut={item.statut} />
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-jp-gray shrink-0 flex-wrap">
          <a href={`mailto:${item.email}?subject=Re: ${item.sujet}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-jp-blue text-white font-nunito font-semibold text-sm rounded-xl hover:bg-jp-blue2 transition-colors">
            <Mail size={14} /> Répondre
          </a>
          <div className="flex gap-2 ml-auto">
            {['nouveau', 'en_cours', 'traite'].filter(s => s !== item.statut).map(s => (
              <button key={s} onClick={() => onStatut(item.id, s)}
                className="px-3 py-2 border border-jp-gray text-jp-graphite font-nunito font-semibold text-xs rounded-xl hover:bg-gray-50 transition-colors">
                → {STATUTS[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Page principale ── */
export default function AdminDemandes() {
  const [tab, setTab] = useState('devis')
  const [demandes, setDemandes] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDevis, setSelectedDevis] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [d, m] = await Promise.all([getDemandes(), getMessages()])
      setDemandes(d)
      setMessages(m)
    } catch (err) {
      console.error('Erreur chargement demandes:', err)
      showToast('Erreur de chargement.', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDevisStatut(id, statut) {
    try {
      await updateDemandeStatut(id, statut)
      setDemandes(prev => prev.map(d => d.id === id ? { ...d, statut } : d))
      if (selectedDevis?.id === id) setSelectedDevis(d => ({ ...d, statut }))
      showToast('Statut mis à jour.')
    } catch { showToast('Erreur.', 'error') }
  }

  async function handleMessageStatut(id, statut) {
    try {
      await updateMessageStatut(id, statut)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, statut } : m))
      if (selectedMessage?.id === id) setSelectedMessage(m => ({ ...m, statut }))
      showToast('Statut mis à jour.')
    } catch { showToast('Erreur.', 'error') }
  }

  const nouveauxDevis = demandes.filter(d => d.statut === 'nouveau').length
  const nouveauxMessages = messages.filter(m => m.statut === 'nouveau').length

  const SkeletonRow = () => (
    <div className="h-16 bg-jp-gray rounded-xl animate-pulse mb-2" />
  )

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-roboto font-bold text-2xl text-jp-graphite">Demandes reçues</h1>
            <p className="font-nunito text-jp-gray2 text-sm mt-1">
              Devis et messages de vos clients.
            </p>
          </div>
          <button onClick={load} className="flex items-center gap-2 border border-jp-gray text-jp-graphite font-nunito font-semibold text-sm rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors">
            <RefreshCw size={15} /> Actualiser
          </button>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {[
            { key: 'devis',    label: 'Demandes de devis', icon: FileText,     count: nouveauxDevis },
            { key: 'messages', label: 'Messages contact',  icon: MessageSquare, count: nouveauxMessages },
          ].map(({ key, label, icon: Icon, count }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 font-nunito font-semibold text-sm rounded-lg px-4 py-2 transition-colors ${
                tab === key ? 'bg-white text-jp-graphite shadow-sm' : 'text-jp-gray2 hover:text-jp-graphite'
              }`}>
              <Icon size={15} />
              {label}
              {count > 0 && (
                <span className="bg-orange-500 text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TABLE DEVIS ── */}
        {tab === 'devis' && (
          <div className="bg-white rounded-xl shadow-sm border border-jp-gray overflow-hidden">
            {loading ? (
              <div className="p-5">{[1,2,3,4].map(i => <SkeletonRow key={i} />)}</div>
            ) : demandes.length === 0 ? (
              <div className="p-16 text-center font-nunito text-jp-gray2">
                Aucune demande de devis pour l'instant.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-jp-gray">
                      {['Date', 'Client', 'Service', 'Délai', 'Statut', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-nunito font-semibold text-jp-gray2 text-xs uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {demandes.map((d, i) => (
                      <tr key={d.id}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${i < demandes.length - 1 ? 'border-b border-jp-gray' : ''} ${d.statut === 'nouveau' ? 'bg-orange-50/40' : ''}`}
                        onClick={() => setSelectedDevis(d)}
                      >
                        <td className="px-4 py-3.5 font-nunito text-jp-gray2 text-xs whitespace-nowrap">
                          {formatDate(d.created_at)}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-nunito font-semibold text-jp-graphite text-sm">{d.prenom} {d.nom}</p>
                          <p className="font-nunito text-jp-gray2 text-xs">{d.email}</p>
                        </td>
                        <td className="px-4 py-3.5 font-nunito text-jp-graphite text-sm">{d.service}</td>
                        <td className="px-4 py-3.5 font-nunito text-jp-gray2 text-sm">{d.delai}</td>
                        <td className="px-4 py-3.5"><StatutBadge statut={d.statut} /></td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="font-nunito text-jp-cyan text-xs hover:underline">Voir →</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TABLE MESSAGES ── */}
        {tab === 'messages' && (
          <div className="bg-white rounded-xl shadow-sm border border-jp-gray overflow-hidden">
            {loading ? (
              <div className="p-5">{[1,2,3,4].map(i => <SkeletonRow key={i} />)}</div>
            ) : messages.length === 0 ? (
              <div className="p-16 text-center font-nunito text-jp-gray2">
                Aucun message de contact pour l'instant.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-jp-gray">
                      {['Date', 'Expéditeur', 'Sujet', 'Statut', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-nunito font-semibold text-jp-gray2 text-xs uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((m, i) => (
                      <tr key={m.id}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${i < messages.length - 1 ? 'border-b border-jp-gray' : ''} ${m.statut === 'nouveau' ? 'bg-orange-50/40' : ''}`}
                        onClick={() => setSelectedMessage(m)}
                      >
                        <td className="px-4 py-3.5 font-nunito text-jp-gray2 text-xs whitespace-nowrap">
                          {formatDate(m.created_at)}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-nunito font-semibold text-jp-graphite text-sm">{m.nom}</p>
                          <p className="font-nunito text-jp-gray2 text-xs">{m.email}</p>
                        </td>
                        <td className="px-4 py-3.5 font-nunito text-jp-graphite text-sm line-clamp-1 max-w-[200px]">
                          {m.sujet}
                        </td>
                        <td className="px-4 py-3.5"><StatutBadge statut={m.statut} /></td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="font-nunito text-jp-cyan text-xs hover:underline">Voir →</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedDevis && (
        <DevisModal
          item={selectedDevis}
          onClose={() => setSelectedDevis(null)}
          onStatut={(id, s) => { handleDevisStatut(id, s); setSelectedDevis(d => ({ ...d, statut: s })) }}
        />
      )}

      {selectedMessage && (
        <MessageModal
          item={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onStatut={(id, s) => { handleMessageStatut(id, s); setSelectedMessage(m => ({ ...m, statut: s })) }}
        />
      )}

      <Toast toast={toast} onHide={hideToast} />
    </>
  )
}
