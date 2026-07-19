import { supabase } from '../lib/supabase'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Les demandes/messages sont protégés côté base (RLS) : la lecture et la
// mise à jour du statut passent par la fonction admin-leads, qui vérifie
// la clé admin plutôt que d'exposer ces tables en lecture publique.
async function callAdminLeads(path, options = {}) {
  const adminKey = sessionStorage.getItem('admin_key') || ''
  const res = await fetch(`${FUNCTIONS_URL}/admin-leads${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ANON_KEY}`,
      'x-admin-key': adminKey,
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur admin-leads')
  return data
}

// ── UTILS ─────────────────────────────────────────────────────────────────────
function extractStoragePath(publicUrl) {
  try {
    const marker = '/object/public/jo-prime-images/'
    const idx = publicUrl.indexOf(marker)
    if (idx === -1) return null
    return publicUrl.slice(idx + marker.length)
  } catch {
    return null
  }
}

// ── PRODUITS ──────────────────────────────────────────────────────────────────
export async function getProduits() {
  const { data, error } = await supabase
    .from('produits')
    .select('*')
    .order('nom')
  if (error) throw error
  return data
}

export async function updateProduit(slug, data) {
  const { error } = await supabase
    .from('produits')
    .update(data)
    .eq('slug', slug)
  if (error) throw error
}

export async function uploadImageProduit(slug, file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const path = `produits/${slug}/principale.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('jo-prime-images')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('jo-prime-images')
    .getPublicUrl(path)

  return data.publicUrl
}

// ── RÉALISATIONS ──────────────────────────────────────────────────────────────
export async function getRealisations(onlyActifs = false) {
  let query = supabase
    .from('realisations')
    .select('*')
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: false })

  if (onlyActifs) query = query.eq('actif', true)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function addRealisation(data) {
  const { data: inserted, error } = await supabase
    .from('realisations')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return inserted
}

export async function updateRealisation(id, data) {
  const { error } = await supabase
    .from('realisations')
    .update(data)
    .eq('id', id)
  if (error) throw error
}

export async function deleteRealisation(id, imageUrl) {
  if (imageUrl) {
    const path = extractStoragePath(imageUrl)
    if (path) {
      await supabase.storage.from('jo-prime-images').remove([path])
    }
  }
  const { error } = await supabase
    .from('realisations')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function uploadImageRealisation(file) {
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `realisations/${timestamp}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('jo-prime-images')
    .upload(path, file, { contentType: file.type })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('jo-prime-images')
    .getPublicUrl(path)

  return data.publicUrl
}

// ── VARIANTES ─────────────────────────────────────────────────────────────────
export async function getVariantesBySlug(slug) {
  const { data, error } = await supabase
    .from('variantes')
    .select('*')
    .eq('produit_slug', slug)
    .order('ordre', { ascending: true })
  if (error) throw error
  return data
}

export async function getVariantesGroupees() {
  const { data, error } = await supabase
    .from('variantes')
    .select('*')
    .order('produit_slug')
    .order('ordre', { ascending: true })

  if (error) throw error

  const grouped = {}
  for (const v of data) {
    if (!grouped[v.produit_slug]) grouped[v.produit_slug] = []
    grouped[v.produit_slug].push(v)
  }
  return grouped
}

export async function updateVariante(id, data) {
  const { error } = await supabase
    .from('variantes')
    .update(data)
    .eq('id', id)
  if (error) throw error
}

export async function addVariante(data) {
  const { data: inserted, error } = await supabase
    .from('variantes')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return inserted
}

export async function deleteVariante(id) {
  const { error } = await supabase
    .from('variantes')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── DEMANDES DEVIS ────────────────────────────────────────────────────────────
export async function addDemandeDevis(data) {
  // Pas de .select() : la policy RLS n'autorise que l'INSERT pour anon,
  // pas la relecture de la ligne insérée.
  const { error } = await supabase.from('demandes_devis').insert(data)
  if (error) throw error
}

export async function getDemandes() {
  return callAdminLeads('?table=demandes_devis')
}

export async function updateDemandeStatut(id, statut) {
  await callAdminLeads('', {
    method: 'PATCH',
    body: JSON.stringify({ table: 'demandes_devis', id, statut }),
  })
}

// ── MESSAGES CONTACT ──────────────────────────────────────────────────────────
export async function addMessageContact(data) {
  // Pas de .select() : la policy RLS n'autorise que l'INSERT pour anon,
  // pas la relecture de la ligne insérée.
  const { error } = await supabase.from('messages_contact').insert(data)
  if (error) throw error
}

export async function getMessages() {
  return callAdminLeads('?table=messages_contact')
}

export async function updateMessageStatut(id, statut) {
  await callAdminLeads('', {
    method: 'PATCH',
    body: JSON.stringify({ table: 'messages_contact', id, statut }),
  })
}

// ── PARAMÈTRES ────────────────────────────────────────────────────────────────
export async function getParametres() {
  const { data, error } = await supabase
    .from('parametres_site')
    .select('*')
  if (error) throw error

  const obj = {}
  for (const p of data) {
    obj[p.cle] = p.valeur ?? ''
  }
  return obj
}

export async function updateParametre(cle, valeur) {
  const { error } = await supabase
    .from('parametres_site')
    .upsert({ cle, valeur }, { onConflict: 'cle' })
  if (error) throw error
}
