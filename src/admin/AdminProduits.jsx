import { useState, useEffect } from 'react'
import { Pencil, X, Upload } from 'lucide-react'
import { getProduits, updateProduit } from '../hooks/useSupabaseSite'
import { Toast, useToast } from '../components/ui/Toast'

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
    img.onerror = () => {
      URL.revokeObjectURL(blobUrl)
      reject(new Error("Impossible de lire l'image"))
    }
    img.src = blobUrl
  })
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-jp-gray animate-pulse">
      <div className="h-4 bg-jp-gray rounded w-2/3 mb-2" />
      <div className="h-3 bg-jp-gray rounded w-1/3 mb-4" />
      <div className="h-8 bg-jp-gray rounded" />
    </div>
  )
}

export default function AdminProduits() {
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [converting, setConverting] = useState(false)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => { loadProduits() }, [])

  async function loadProduits() {
    try {
      setProduits(await getProduits())
    } catch (err) {
      console.error('Erreur getProduits:', err)
      showToast('Erreur lors du chargement des produits.', 'error')
    } finally {
      setLoading(false)
    }
  }

  function openEdit(produit) {
    setEditing(produit)
    setEditForm({ nom: produit.nom, tagline: produit.tagline || '', description: produit.description || '' })
    setPreviewUrl(null)
    setUploadFile(null)
  }

  function closeEdit() {
    setEditing(null)
    setEditForm({})
    setPreviewUrl(null)
    setUploadFile(null)
  }

  async function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Format non supporté. Utilisez JPG, PNG ou WebP.', 'error')
      e.target.value = ''
      return
    }
    setConverting(true)
    try {
      const base64 = await compressImage(file)
      setUploadFile(file)
      setPreviewUrl(base64)
    } catch (err) {
      console.error('Erreur compression:', err)
      showToast('Erreur lors de la compression.', 'error')
    } finally {
      setConverting(false)
      e.target.value = ''
    }
  }

  async function handleToggle(slug, current) {
    try {
      await updateProduit(slug, { actif: !current })
      setProduits(prev => prev.map(p => p.slug === slug ? { ...p, actif: !current } : p))
      showToast(`Produit ${!current ? 'activé' : 'désactivé'}.`)
    } catch (err) {
      console.error('Erreur toggle produit:', err)
      showToast('Erreur lors de la mise à jour.', 'error')
    }
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const updates = { ...editForm }
      if (uploadFile && previewUrl) {
        updates.image_url = previewUrl
      }
      await updateProduit(editing.slug, updates)
      await loadProduits()
      closeEdit()
      showToast('Produit mis à jour avec succès !')
    } catch (err) {
      console.error('Erreur updateProduit:', err)
      const msg = err?.message || 'Erreur lors de la sauvegarde.'
      showToast(msg.length > 80 ? 'Erreur de sauvegarde. Voir console (F12).' : msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="font-roboto font-bold text-2xl text-jp-graphite">Produits</h1>
          <p className="font-nunito text-jp-gray2 text-sm mt-1">Gérez les informations et le statut de vos produits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? [1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)
            : produits.map(produit => (
              <div key={produit.slug} className="bg-white rounded-xl p-5 shadow-sm border border-jp-gray">
                {/* Aperçu image si disponible */}
                {produit.image_url && (
                  <img
                    src={produit.image_url}
                    alt={produit.nom}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-nunito font-bold text-jp-graphite flex-1 min-w-0 truncate pr-2">
                    {produit.nom}
                  </h3>
                  <span className={`shrink-0 font-nunito text-xs font-bold rounded-full px-2.5 py-0.5 ${produit.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {produit.actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="font-nunito text-jp-gray2 text-xs mb-1">{produit.slug}</p>
                {produit.tagline && (
                  <p className="font-nunito text-sm italic mb-3 line-clamp-1 text-jp-gray2">
                    {produit.tagline}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEdit(produit)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-jp-blue text-white font-nunito font-semibold text-sm rounded-lg py-2 hover:bg-jp-blue2 transition-colors"
                  >
                    <Pencil size={14} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleToggle(produit.slug, produit.actif)}
                    className={`px-3 py-2 rounded-lg font-nunito font-semibold text-xs transition-colors ${
                      produit.actif
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {produit.actif ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeEdit} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-jp-gray shrink-0">
              <h2 className="font-nunito font-bold text-jp-graphite">Modifier — {editing.nom}</h2>
              <button onClick={closeEdit} className="text-jp-gray2 hover:text-jp-graphite transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Nom du produit</label>
                <input
                  value={editForm.nom || ''}
                  onChange={e => setEditForm(f => ({ ...f, nom: e.target.value }))}
                  className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue"
                />
              </div>

              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Tagline</label>
                <input
                  value={editForm.tagline || ''}
                  onChange={e => setEditForm(f => ({ ...f, tagline: e.target.value }))}
                  className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue"
                  placeholder="Votre première impression compte"
                />
              </div>

              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-jp-gray rounded-lg px-4 py-2.5 font-nunito text-sm focus:outline-none focus:border-jp-blue resize-none"
                />
              </div>

              {/* Image */}
              <div>
                <label className="font-nunito text-sm font-semibold text-jp-graphite mb-1.5 block">
                  Image principale
                  {converting && <span className="ml-2 text-jp-cyan font-normal text-xs">Compression…</span>}
                  {uploadFile && !converting && <span className="ml-2 text-jp-cyan font-normal text-xs">✓ Nouvelle image prête</span>}
                </label>
                <label className="block w-full border-2 border-dashed border-jp-gray rounded-xl cursor-pointer hover:border-jp-cyan transition-colors text-center overflow-hidden">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={converting}
                  />
                  {previewUrl ? (
                    <img src={previewUrl} alt="Nouvelle image" className="max-h-44 w-full object-cover" />
                  ) : editing.image_url ? (
                    <div>
                      <img src={editing.image_url} alt="Image actuelle" className="max-h-44 w-full object-cover" />
                      <p className="font-nunito text-jp-gray2 text-xs py-2">Cliquer pour remplacer l'image</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload size={28} className="text-jp-gray2 mx-auto mb-2" />
                      <p className="font-nunito text-jp-gray2 text-sm">Cliquer pour sélectionner une image</p>
                      <p className="font-nunito text-jp-gray2 text-xs mt-1">JPG, PNG, WebP — Compression auto</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-jp-gray shrink-0">
              <button
                onClick={closeEdit}
                className="flex-1 border border-jp-gray text-jp-graphite font-nunito font-semibold rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || converting}
                className="flex-1 bg-jp-blue text-white font-nunito font-bold rounded-xl py-2.5 hover:bg-jp-blue2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? 'Enregistrement…' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onHide={hideToast} />
    </>
  )
}
