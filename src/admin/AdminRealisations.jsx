import { useState, useEffect, useRef } from 'react'
import { Trash2, Pencil, Eye, EyeOff, Upload, X, Plus } from 'lucide-react'
import {
  getRealisations, addRealisation, updateRealisation, deleteRealisation,
} from '../hooks/useSupabaseSite'
import { Toast, useToast } from '../components/ui/Toast'

const CATEGORIES = [
  'Cartes de visite',
  'Affiches & Flyers',
  'Bâches',
  'Photocopies',
  'Décoration',
  'Kakémonos',
]

const INITIAL_FORM = { titre: '', categorie: '', description: '', ordre: 0, actif: true }

const BG_MAP = {
  'Cartes de visite': 'bg-jp-blue',
  'Affiches & Flyers': 'bg-jp-cyan',
  'Bâches': 'bg-jp-graphite',
  'Photocopies': 'bg-jp-blue2',
  'Décoration': 'bg-jp-blue',
  'Kakémonos': 'bg-jp-blue2',
}

function validateFile(f) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type))
    return 'Format non supporté. Utilisez JPG, PNG ou WebP.'
  if (f.size > 15 * 1024 * 1024)
    return 'Fichier trop volumineux (max 15 Mo).'
  return null
}

function compressImage(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const blobUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(blobUrl)
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round(height * maxWidth / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error('Impossible de lire l\'image')) }
    img.src = blobUrl
  })
}

/* ── Zone de dépôt ── */
function UploadZone({ preview, dragOver, onDrop, onDragOver, onDragLeave, onClick, error, converting }) {
  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          dragOver ? 'border-jp-cyan bg-jp-cyan-l/30 scale-[1.01]' : 'border-jp-gray hover:border-jp-cyan hover:bg-gray-50'
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-44 mx-auto rounded-lg object-cover" />
        ) : (
          <div className="py-4">
            <Upload size={28} className="text-jp-gray2 mx-auto mb-2" />
            <p className="font-nunito font-semibold text-jp-graphite text-sm mb-0.5">
              Glissez-déposez ou cliquez
            </p>
            <p className="font-nunito text-jp-gray2 text-xs">JPG, PNG, WebP — Compression automatique</p>
          </div>
        )}
      </div>
      {error && <p className="font-nunito text-red-500 text-xs mt-1">{error}</p>}
      {converting && <p className="font-nunito text-jp-cyan text-xs mt-1">Conversion en cours…</p>}
    </div>
  )
}

export default function AdminRealisations() {
  const [tab, setTab] = useState('liste')
  const [realisations, setRealisations] = useState([])
  const [loading, setLoading] = useState(true)

  /* ── Ajout ── */
  const [form, setForm] = useState(INITIAL_FORM)
  const [preview, setPreview] = useState(null)       // base64 data URL
  const [fileError, setFileError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [converting, setConverting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  /* ── Édition ── */
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editPreview, setEditPreview] = useState(null)  // base64 ou URL existante
  const [editHasNewImage, setEditHasNewImage] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const editFileRef = useRef(null)

  const { toast, showToast, hideToast } = useToast()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setRealisations(await getRealisations()) }
    catch { showToast('Erreur de chargement.', 'error') }
    finally { setLoading(false) }
  }

  /* ── Sélection / conversion fichier ── */
  async function selectFile(f, isEdit = false) {
    if (!f) return
    const err = validateFile(f)
    if (err) {
      if (isEdit) showToast(err, 'error')
      else setFileError(err)
      return
    }
    setConverting(true)
    try {
      const base64 = await compressImage(f)
      if (isEdit) {
        setEditPreview(base64)
        setEditHasNewImage(true)
      } else {
        setFileError('')
        setPreview(base64)
      }
    } catch {
      if (isEdit) showToast('Erreur lors de la compression.', 'error')
      else setFileError('Impossible de traiter le fichier.')
    } finally {
      setConverting(false)
    }
  }

  /* ── Ajouter ── */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!preview) { setFileError('Veuillez sélectionner une image.'); return }
    setSubmitting(true)
    try {
      await addRealisation({ ...form, image_url: preview })
      showToast('Réalisation ajoutée !')
      setForm(INITIAL_FORM); setPreview(null)
      await load(); setTab('liste')
    } catch (err) {
      console.error('Erreur addRealisation:', err)
      const msg = err?.message || "Erreur lors de l'ajout."
      showToast(msg.length > 80 ? "Erreur lors de l'ajout. Voir console (F12)." : msg, 'error')
    } finally { setSubmitting(false) }
  }

  /* ── Toggle actif ── */
  async function handleToggle(id, current) {
    try {
      await updateRealisation(id, { actif: !current })
      setRealisations(prev => prev.map(r => r.id === id ? { ...r, actif: !current } : r))
      showToast(`Réalisation ${!current ? 'publiée' : 'masquée'}.`)
    } catch { showToast('Erreur.', 'error') }
  }

  /* ── Supprimer ── */
  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette réalisation ? Cette action est irréversible.')) return
    try {
      await deleteRealisation(id)
      setRealisations(prev => prev.filter(r => r.id !== id))
      showToast('Réalisation supprimée.')
    } catch (err) {
      console.error('Erreur deleteRealisation:', err)
      showToast('Erreur lors de la suppression.', 'error')
    }
  }

  /* ── Modal édition ── */
  function openEdit(r) {
    setEditing(r)
    setEditForm({ titre: r.titre, categorie: r.categorie, description: r.description || '' })
    setEditPreview(r.image_url || null)
    setEditHasNewImage(false)
  }
  function closeEdit() {
    setEditing(null); setEditForm({})
    setEditPreview(null); setEditHasNewImage(false)
  }

  async function handleEditSave() {
    setEditSaving(true)
    try {
      const updates = { ...editForm }
      if (editHasNewImage && editPreview) updates.image_url = editPreview
      await updateRealisation(editing.id, updates)
      await load()
      closeEdit()
      showToast('Réalisation mise à jour !')
    } catch (err) {
      console.error('Erreur updateRealisation:', err)
      showToast('Erreur lors de la sauvegarde.', 'error')
    } finally { setEditSaving(false) }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-roboto font-bold text-2xl text-jp-graphite">Réalisations</h1>
            <p className="font-nunito text-jp-gray2 text-sm mt-1">Gérez votre portfolio.</p>
          </div>
          <button
            onClick={() => setTab(tab === 'ajouter' ? 'liste' : 'ajouter')}
            className="flex items-center gap-2 bg-jp-blue text-white font-nunito font-semibold rounded-xl px-4 py-2.5 hover:bg-jp-blue2 transition-colors"
          >
            {tab === 'ajouter' ? <><X size={16} /> Annuler</> : <><Plus size={16} /> Ajouter</>}
          </button>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {[['liste', 'Liste'], ['ajouter', 'Ajouter']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`font-nunito font-semibold text-sm rounded-lg px-5 py-2 transition-colors ${
                tab === key ? 'bg-white text-jp-graphite shadow-sm' : 'text-jp-gray2 hover:text-jp-graphite'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── LISTE ── */}
        {tab === 'liste' && (
          loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-jp-gray animate-pulse">
                  <div className="h-40 bg-jp-gray" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-jp-gray rounded w-3/4" />
                    <div className="h-3 bg-jp-gray rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : realisations.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center border border-jp-gray shadow-sm">
              <p className="font-nunito text-jp-gray2">Aucune réalisation. Commencez par en ajouter une !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {realisations.map(r => (
                <div key={r.id}
                  className={`bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow ${r.actif ? 'border-jp-gray' : 'border-gray-200 opacity-70'}`}
                >
                  <div className="relative">
                    {r.image_url ? (
                      <img src={r.image_url} alt={r.titre} className="w-full h-40 object-cover" />
                    ) : (
                      <div className={`w-full h-40 flex items-center justify-center ${BG_MAP[r.categorie] || 'bg-jp-blue'}`}>
                        <span className="font-nunito font-black text-white/20 text-5xl select-none">
                          {r.categorie?.[0] || '?'}
                        </span>
                      </div>
                    )}
                    {!r.actif && (
                      <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                        <span className="bg-gray-700 text-white font-nunito text-xs font-bold rounded-full px-3 py-1">Masqué</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <span className="bg-jp-cyan-l text-jp-blue font-nunito font-semibold text-xs rounded-full px-2.5 py-0.5">
                      {r.categorie}
                    </span>
                    <h3 className="font-nunito font-bold text-jp-graphite mt-2 mb-0.5 line-clamp-1 text-sm">{r.titre}</h3>
                    {r.description && (
                      <p className="font-nunito text-jp-gray2 text-xs line-clamp-1">{r.description}</p>
                    )}

                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openEdit(r)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-nunito font-semibold bg-jp-blue text-white hover:bg-jp-blue2 transition-colors">
                        <Pencil size={12} /> Modifier
                      </button>
                      <button onClick={() => handleToggle(r.id, r.actif)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-nunito font-semibold transition-colors ${
                          r.actif ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}>
                        {r.actif ? <EyeOff size={12} /> : <Eye size={12} />}
                        {r.actif ? 'Masquer' : 'Publier'}
                      </button>
                      <button onClick={() => handleDelete(r.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-nunito font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-auto">
                        <Trash2 size={12} /> Sup.
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── AJOUTER ── */}
        {tab === 'ajouter' && (
          <div className="bg-white rounded-xl shadow-sm border border-jp-gray p-6 max-w-2xl">
            <h2 className="font-nunito font-bold text-jp-graphite text-lg mb-6">Nouvelle réalisation</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Titre <span className="text-jp-cyan">*</span></label>
                <input required value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                  className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue"
                  placeholder="Ex : Bâche événementielle forum emploi" />
              </div>

              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Catégorie <span className="text-jp-cyan">*</span></label>
                <select required value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                  className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue bg-white">
                  <option value="">Sélectionnez une catégorie</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue resize-none"
                  placeholder="Brève description du projet..." />
              </div>

              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Photo <span className="text-jp-cyan">*</span></label>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={async e => { await selectFile(e.target.files[0]); e.target.value = '' }} />
                <UploadZone
                  preview={preview} dragOver={dragOver} converting={converting}
                  onDrop={async e => { e.preventDefault(); setDragOver(false); await selectFile(e.dataTransfer.files[0]) }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  error={fileError}
                />
                {preview && (
                  <button type="button" onClick={() => setPreview(null)}
                    className="mt-1.5 font-nunito text-xs text-red-400 hover:text-red-600">
                    × Retirer l'image
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Ordre</label>
                  <input type="number" min={0} value={form.ordre}
                    onChange={e => setForm(f => ({ ...f, ordre: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue" />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer pb-2.5">
                    <div onClick={() => setForm(f => ({ ...f, actif: !f.actif }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.actif ? 'bg-jp-cyan' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.actif ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className="font-nunito text-sm font-semibold text-jp-graphite">Publier immédiatement</span>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={submitting || converting}
                className="w-full bg-jp-blue text-white font-nunito font-bold rounded-xl py-3.5 hover:bg-jp-blue2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? 'Ajout en cours…' : 'Ajouter la réalisation'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── MODAL ÉDITION ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeEdit} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-jp-gray shrink-0">
              <h2 className="font-nunito font-bold text-jp-graphite">Modifier la réalisation</h2>
              <button onClick={closeEdit} className="text-jp-gray2 hover:text-jp-graphite"><X size={22} /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Titre</label>
                <input value={editForm.titre || ''} onChange={e => setEditForm(f => ({ ...f, titre: e.target.value }))}
                  className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue" />
              </div>

              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Catégorie</label>
                <select value={editForm.categorie || ''} onChange={e => setEditForm(f => ({ ...f, categorie: e.target.value }))}
                  className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue bg-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Description</label>
                <textarea value={editForm.description || ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue resize-none" />
              </div>

              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">
                  Photo {editHasNewImage && <span className="text-jp-cyan font-normal text-xs">• nouvelle image sélectionnée</span>}
                </label>
                <input ref={editFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={async e => { await selectFile(e.target.files[0], true); e.target.value = '' }} />
                <div
                  className="border-2 border-dashed border-jp-gray rounded-xl cursor-pointer hover:border-jp-cyan transition-colors overflow-hidden"
                  onClick={() => editFileRef.current?.click()}
                >
                  {editPreview ? (
                    <div>
                      <img src={editPreview} alt="Image" className="w-full max-h-44 object-cover" />
                      <p className="font-nunito text-jp-gray2 text-xs text-center py-2">Cliquer pour remplacer</p>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Upload size={24} className="text-jp-gray2 mx-auto mb-2" />
                      <p className="font-nunito text-jp-gray2 text-sm">Cliquer pour ajouter une image</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-jp-gray shrink-0">
              <button onClick={closeEdit}
                className="flex-1 border border-jp-gray text-jp-graphite font-nunito font-semibold rounded-xl py-2.5 hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button onClick={handleEditSave} disabled={editSaving}
                className="flex-1 bg-jp-blue text-white font-nunito font-bold rounded-xl py-2.5 hover:bg-jp-blue2 transition-colors disabled:opacity-60">
                {editSaving ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onHide={hideToast} />
    </>
  )
}
