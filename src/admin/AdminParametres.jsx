import { useState, useEffect } from 'react'
import { Save, ExternalLink, Key, Tag } from 'lucide-react'
import { getParametres, updateParametre } from '../hooks/useSupabaseSite'
import { Toast, useToast } from '../components/ui/Toast'

const KNOWN_PARAMS = [
  { cle: 'telephone', label: 'Téléphone', type: 'tel', placeholder: '+224 625 50 50 39' },
  { cle: 'whatsapp', label: 'Numéro WhatsApp', type: 'text', placeholder: '224625505039 (sans +, sans espaces)' },
  { cle: 'email', label: 'Email de contact', type: 'email', placeholder: 'joprimeprint@gmail.com' },
  { cle: 'adresse', label: 'Adresse', type: 'text', placeholder: 'Conakry, Guinée' },
  { cle: 'horaires', label: 'Horaires d\'ouverture', type: 'text', placeholder: 'Lun–Sam : 8h–18h' },
  { cle: 'facebook', label: 'Facebook (URL)', type: 'url', placeholder: 'https://facebook.com/joprime' },
  { cle: 'instagram', label: 'Instagram (URL)', type: 'url', placeholder: 'https://instagram.com/joprime' },
]

export default function AdminParametres() {
  const [params, setParams] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [savingPwd, setSavingPwd] = useState(false)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setParams(await getParametres())
    } catch {
      showToast('Erreur de chargement des paramètres.', 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(cle, valeur) {
    setParams(prev => ({ ...prev, [cle]: valeur }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await Promise.all([
        ...KNOWN_PARAMS.map(({ cle }) =>
          updateParametre(cle, params[cle] ?? '')
        ),
        updateParametre('afficher_prix', params.afficher_prix ?? 'true'),
      ])
      showToast('Paramètres sauvegardés avec succès !')
    } catch {
      showToast('Erreur lors de la sauvegarde.', 'error')
    } finally {
      setSaving(false)
    }
  }

  function handlePasswordSave(e) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      showToast('Le mot de passe doit faire au moins 6 caractères.', 'error')
      return
    }
    setSavingPwd(true)
    localStorage.setItem('admin_password', newPassword)
    setTimeout(() => {
      setNewPassword('')
      setSavingPwd(false)
      showToast('Mot de passe mis à jour ! Effectif à la prochaine connexion.')
    }, 300)
  }

  return (
    <>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="font-roboto font-bold text-2xl text-jp-graphite">Paramètres du site</h1>
          <p className="font-nunito text-jp-gray2 text-sm mt-1">
            Ces informations sont utilisées sur l'ensemble du site.
          </p>
        </div>

        {/* Formulaire paramètres */}
        <div className="bg-white rounded-xl shadow-sm border border-jp-gray p-6">
          <h2 className="font-nunito font-bold text-jp-graphite mb-6 flex items-center gap-2">
            <Save size={18} className="text-jp-blue" />
            Informations de contact
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-jp-gray rounded w-1/4 mb-2" />
                  <div className="h-10 bg-jp-gray rounded" />
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              {KNOWN_PARAMS.map(({ cle, label, type, placeholder }) => (
                <div key={cle}>
                  <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">
                    {label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={type}
                      value={params[cle] ?? ''}
                      onChange={e => handleChange(cle, e.target.value)}
                      placeholder={placeholder}
                      className="flex-1 border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue transition-colors"
                    />
                    {/* Bouton test WhatsApp */}
                    {cle === 'whatsapp' && params.whatsapp && (
                      <a
                        href={`https://wa.me/${params.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Tester le lien WhatsApp"
                        className="flex items-center gap-1.5 px-3 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-nunito font-semibold whitespace-nowrap"
                      >
                        <ExternalLink size={14} />
                        Tester
                      </a>
                    )}
                    {/* Bouton ouvrir URL */}
                    {(cle === 'facebook' || cle === 'instagram') && params[cle] && (
                      <a
                        href={params[cle]}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ouvrir le lien"
                        className="flex items-center px-3 py-2.5 bg-jp-cyan-l text-jp-blue rounded-lg hover:bg-jp-cyan hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* Affichage des prix */}
              <div className="pt-3 border-t border-jp-gray">
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 flex items-center gap-1.5">
                  <Tag size={15} className="text-jp-blue" />
                  Affichage des prix
                </label>
                <p className="font-nunito text-jp-gray2 text-xs mb-3">
                  Si désactivé, les tarifs sont masqués sur tout le site (accueil et pages produits) et remplacés par la mention « Prix sur devis ».
                </p>
                <div className="flex items-center gap-3">
                  <div
                    role="switch"
                    aria-checked={params.afficher_prix !== 'false'}
                    onClick={() => handleChange('afficher_prix', params.afficher_prix === 'false' ? 'true' : 'false')}
                    className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors shrink-0 ${
                      params.afficher_prix !== 'false' ? 'bg-jp-cyan' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        params.afficher_prix !== 'false' ? 'translate-x-5' : ''
                      }`}
                    />
                  </div>
                  <span className="font-nunito font-semibold text-sm text-jp-graphite">
                    {params.afficher_prix !== 'false' ? 'Prix affichés sur le site' : 'Prix masqués — « Prix sur devis » affiché'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-jp-blue text-white font-nunito font-bold rounded-xl px-6 py-3 hover:bg-jp-blue2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save size={17} />
                  {saving ? 'Sauvegarde…' : 'Sauvegarder les paramètres'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Mot de passe admin */}
        <div className="bg-white rounded-xl shadow-sm border border-jp-gray p-6">
          <h2 className="font-nunito font-bold text-jp-graphite mb-2 flex items-center gap-2">
            <Key size={18} className="text-jp-blue" />
            Mot de passe administrateur
          </h2>
          <p className="font-nunito text-jp-gray2 text-xs mb-5">
            Le nouveau mot de passe sera effectif à la prochaine connexion.
          </p>

          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                minLength={6}
                className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue"
                placeholder="Minimum 6 caractères"
              />
            </div>
            <button
              type="submit"
              disabled={savingPwd || !newPassword}
              className="flex items-center gap-2 bg-jp-graphite text-white font-nunito font-bold rounded-xl px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Key size={17} />
              {savingPwd ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </div>
      </div>

      <Toast toast={toast} onHide={hideToast} />
    </>
  )
}
