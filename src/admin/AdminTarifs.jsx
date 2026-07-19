import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Save, Plus, Trash2 } from 'lucide-react'
import {
  getVariantesGroupees, updateVariante, addVariante, deleteVariante,
} from '../hooks/useSupabaseSite'
import { Toast, useToast } from '../components/ui/Toast'

const PRODUCT_NAMES = {
  'cartes-de-visite': 'Cartes de visite',
  affiches: 'Affiches & Flyers',
  baches: 'Bâches & Banderoles',
  photocopies: 'Photocopies & Impression',
  decoration: 'Décoration & Stickers',
  kakemonos: 'Kakémonos & Roll-up',
}

const EMPTY_NEW = { nom: '', specs: '', prix: '', unite: '', delai: '' }

export default function AdminTarifs() {
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [edits, setEdits] = useState({})
  const [modified, setModified] = useState(new Set())
  const [openSlugs, setOpenSlugs] = useState(new Set())

  /* Ajout variante */
  const [addingFor, setAddingFor] = useState(null)
  const [newForm, setNewForm] = useState(EMPTY_NEW)
  const [addingSaving, setAddingSaving] = useState(false)

  const { toast, showToast, hideToast } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await getVariantesGroupees()
      setGrouped(data)
      setOpenSlugs(new Set(Object.keys(data)))
    } catch { showToast('Erreur de chargement.', 'error') }
    finally { setLoading(false) }
  }

  function toggleSlug(slug) {
    setOpenSlugs(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  function handleEdit(id, field, value) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
    setModified(prev => new Set(prev).add(id))
  }

  function getVal(v, field) {
    return edits[v.id]?.[field] ?? v[field]
  }

  async function handleSave() {
    if (modified.size === 0) { showToast('Aucune modification à sauvegarder.'); return }
    setSaving(true)
    try {
      await Promise.all([...modified].map(id => updateVariante(id, edits[id])))
      setModified(new Set())
      showToast(`${modified.size} variante(s) sauvegardée(s) !`)
    } catch { showToast('Erreur lors de la sauvegarde.', 'error') }
    finally { setSaving(false) }
  }

  async function handleAddVariante(slug) {
    if (!newForm.nom.trim()) { showToast('Le nom est requis.', 'error'); return }
    setAddingSaving(true)
    try {
      await addVariante({
        produit_slug: slug,
        nom: newForm.nom,
        specs: newForm.specs,
        prix: parseInt(newForm.prix) || 0,
        unite: newForm.unite,
        delai: newForm.delai,
        populaire: false,
        ordre: (grouped[slug]?.length ?? 0) + 1,
      })
      showToast('Variante ajoutée !')
      setAddingFor(null)
      setNewForm(EMPTY_NEW)
      await load()
    } catch { showToast("Erreur lors de l'ajout.", 'error') }
    finally { setAddingSaving(false) }
  }

  async function handleDeleteVariante(id) {
    if (!window.confirm('Supprimer cette variante ?')) return
    try {
      await deleteVariante(id)
      setModified(prev => { const s = new Set(prev); s.delete(id); return s })
      setEdits(prev => { const e = { ...prev }; delete e[id]; return e })
      showToast('Variante supprimée.')
      await load()
    } catch { showToast('Erreur lors de la suppression.', 'error') }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl p-5 border border-jp-gray animate-pulse">
            <div className="h-5 bg-jp-gray rounded w-1/3 mb-4" />
            {[1, 2].map(j => <div key={j} className="h-10 bg-jp-gray rounded mb-2" />)}
          </div>
        ))}
      </div>
    )
  }

  const slugs = Object.keys(grouped)

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-roboto font-bold text-2xl text-jp-graphite">Tarifs</h1>
            <p className="font-nunito text-jp-gray2 text-sm mt-1">
              Modifiez les prix et délais. Ajoutez ou supprimez des variantes.
              {modified.size > 0 && (
                <span className="ml-2 bg-orange-100 text-orange-600 font-bold rounded-full px-2 py-0.5 text-xs">
                  {modified.size} modification(s) non sauvegardée(s)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || modified.size === 0}
            className="flex items-center gap-2 bg-jp-blue text-white font-nunito font-bold rounded-xl px-5 py-2.5 hover:bg-jp-blue2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={17} />
            {saving ? 'Sauvegarde…' : `Sauvegarder${modified.size > 0 ? ` (${modified.size})` : ''}`}
          </button>
        </div>

        {slugs.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-jp-gray font-nunito text-jp-gray2">
            Aucune variante trouvée.
          </div>
        ) : (
          slugs.map(slug => {
            const variantes = grouped[slug] ?? []
            const isOpen = openSlugs.has(slug)
            const hasModified = variantes.some(v => modified.has(v.id))
            const isAddingHere = addingFor === slug

            return (
              <div key={slug} className="bg-white rounded-xl shadow-sm border border-jp-gray overflow-hidden">
                {/* Header accordéon */}
                <button
                  onClick={() => toggleSlug(slug)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h2 className="font-nunito font-bold text-jp-graphite">
                      {PRODUCT_NAMES[slug] || slug}
                    </h2>
                    <span className="font-nunito text-jp-gray2 text-xs">{variantes.length} variante{variantes.length > 1 ? 's' : ''}</span>
                    {hasModified && (
                      <span className="bg-orange-100 text-orange-600 font-nunito font-bold text-xs rounded-full px-2.5 py-0.5">Modifié</span>
                    )}
                  </div>
                  {isOpen ? <ChevronUp size={18} className="text-jp-gray2" /> : <ChevronDown size={18} className="text-jp-gray2" />}
                </button>

                {isOpen && (
                  <div className="border-t border-jp-gray">
                    {/* Table variantes */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-jp-gray">
                            {['Variante', 'Specs', 'Prix (GNF)', 'Unité', 'Délai', 'Populaire', ''].map(h => (
                              <th key={h} className="text-left px-4 py-2.5 font-nunito font-semibold text-jp-gray2 text-xs uppercase tracking-wider whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {variantes.map((v, i) => {
                            const isModified = modified.has(v.id)
                            return (
                              <tr key={v.id}
                                className={`${i < variantes.length - 1 ? 'border-b border-jp-gray' : ''} ${isModified ? 'bg-orange-50' : ''}`}
                              >
                                <td className="px-4 py-2.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-nunito font-bold text-jp-graphite text-sm whitespace-nowrap">{v.nom}</span>
                                    {isModified && <span className="bg-orange-100 text-orange-600 font-nunito font-bold text-xs rounded-full px-1.5 py-0.5">●</span>}
                                  </div>
                                </td>
                                <td className="px-4 py-2.5">
                                  <input value={getVal(v, 'specs') || ''}
                                    onChange={e => handleEdit(v.id, 'specs', e.target.value)}
                                    className="w-36 border border-jp-gray rounded-lg px-2 py-1 font-nunito text-xs focus:outline-none focus:border-jp-blue" />
                                </td>
                                <td className="px-4 py-2.5">
                                  <input type="number" min={0} value={getVal(v, 'prix') ?? 0}
                                    onChange={e => handleEdit(v.id, 'prix', parseInt(e.target.value) || 0)}
                                    className="w-24 border border-jp-gray rounded-lg px-2 py-1 font-nunito text-sm focus:outline-none focus:border-jp-blue text-right" />
                                </td>
                                <td className="px-4 py-2.5">
                                  <input value={getVal(v, 'unite') || ''}
                                    onChange={e => handleEdit(v.id, 'unite', e.target.value)}
                                    className="w-24 border border-jp-gray rounded-lg px-2 py-1 font-nunito text-xs focus:outline-none focus:border-jp-blue" />
                                </td>
                                <td className="px-4 py-2.5">
                                  <input value={getVal(v, 'delai') || ''}
                                    onChange={e => handleEdit(v.id, 'delai', e.target.value)}
                                    className="w-24 border border-jp-gray rounded-lg px-2 py-1 font-nunito text-xs focus:outline-none focus:border-jp-blue" />
                                </td>
                                <td className="px-4 py-2.5">
                                  <div
                                    onClick={() => handleEdit(v.id, 'populaire', !getVal(v, 'populaire'))}
                                    className={`relative w-9 h-5 rounded-full cursor-pointer transition-colors ${getVal(v, 'populaire') ? 'bg-jp-cyan' : 'bg-gray-300'}`}
                                  >
                                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${getVal(v, 'populaire') ? 'translate-x-4' : ''}`} />
                                  </div>
                                </td>
                                <td className="px-4 py-2.5">
                                  <button onClick={() => handleDeleteVariante(v.id)}
                                    className="text-red-400 hover:text-red-600 transition-colors p-1" title="Supprimer">
                                    <Trash2 size={15} />
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Formulaire ajout inline */}
                    {isAddingHere ? (
                      <div className="border-t border-jp-gray bg-jp-cyan-l/20 p-4">
                        <p className="font-nunito font-bold text-jp-graphite text-sm mb-3">Nouvelle variante</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="font-nunito text-xs text-jp-gray2 mb-1 block">Nom *</label>
                            <input value={newForm.nom} onChange={e => setNewForm(f => ({ ...f, nom: e.target.value }))}
                              className="w-full border border-jp-gray rounded-lg px-3 py-2 font-nunito text-sm focus:outline-none focus:border-jp-blue bg-white"
                              placeholder="Ex : Premium" />
                          </div>
                          <div>
                            <label className="font-nunito text-xs text-jp-gray2 mb-1 block">Specs</label>
                            <input value={newForm.specs} onChange={e => setNewForm(f => ({ ...f, specs: e.target.value }))}
                              className="w-full border border-jp-gray rounded-lg px-3 py-2 font-nunito text-sm focus:outline-none focus:border-jp-blue bg-white"
                              placeholder="Ex : 85×55mm • 350g" />
                          </div>
                          <div>
                            <label className="font-nunito text-xs text-jp-gray2 mb-1 block">Prix (GNF)</label>
                            <input type="number" min={0} value={newForm.prix} onChange={e => setNewForm(f => ({ ...f, prix: e.target.value }))}
                              className="w-full border border-jp-gray rounded-lg px-3 py-2 font-nunito text-sm focus:outline-none focus:border-jp-blue bg-white"
                              placeholder="0" />
                          </div>
                          <div>
                            <label className="font-nunito text-xs text-jp-gray2 mb-1 block">Unité</label>
                            <input value={newForm.unite} onChange={e => setNewForm(f => ({ ...f, unite: e.target.value }))}
                              className="w-full border border-jp-gray rounded-lg px-3 py-2 font-nunito text-sm focus:outline-none focus:border-jp-blue bg-white"
                              placeholder="Ex : 100 cartes" />
                          </div>
                          <div>
                            <label className="font-nunito text-xs text-jp-gray2 mb-1 block">Délai</label>
                            <input value={newForm.delai} onChange={e => setNewForm(f => ({ ...f, delai: e.target.value }))}
                              className="w-full border border-jp-gray rounded-lg px-3 py-2 font-nunito text-sm focus:outline-none focus:border-jp-blue bg-white"
                              placeholder="Ex : 3-5 jours" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setAddingFor(null); setNewForm(EMPTY_NEW) }}
                            className="px-4 py-2 border border-jp-gray text-jp-graphite font-nunito font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                            Annuler
                          </button>
                          <button onClick={() => handleAddVariante(slug)} disabled={addingSaving}
                            className="px-4 py-2 bg-jp-blue text-white font-nunito font-bold text-sm rounded-xl hover:bg-jp-blue2 transition-colors disabled:opacity-60">
                            {addingSaving ? 'Ajout…' : 'Ajouter la variante'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-jp-gray px-4 py-3">
                        <button
                          onClick={() => { setAddingFor(slug); setNewForm(EMPTY_NEW) }}
                          className="flex items-center gap-2 text-jp-blue font-nunito font-semibold text-sm hover:text-jp-cyan transition-colors"
                        >
                          <Plus size={16} />
                          Ajouter une variante
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}

        {/* Bouton sauvegarde sticky */}
        {modified.size > 0 && (
          <div className="sticky bottom-4">
            <button onClick={handleSave} disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-jp-blue text-white font-nunito font-bold rounded-xl py-3.5 hover:bg-jp-blue2 transition-colors shadow-xl disabled:opacity-60">
              <Save size={18} />
              {saving ? 'Sauvegarde…' : `Sauvegarder ${modified.size} modification(s)`}
            </button>
          </div>
        )}
      </div>

      <Toast toast={toast} onHide={hideToast} />
    </>
  )
}
