import { supabase } from '../lib/supabase'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Toutes les opérations d'écriture admin et la lecture des demandes/messages
// passent par la fonction admin-content, qui vérifie la clé admin côté serveur
// (secret ADMIN_KEY). Les tables sont protégées par RLS : l'anon key ne peut
// que lire le contenu public et insérer des devis/messages.
export async function adminCall(action, payload = {}, adminKey) {
  const key = adminKey ?? sessionStorage.getItem('admin_key') ?? ''
  const res = await fetch(`${FUNCTIONS_URL}/admin-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
      'x-admin-key': key,
    },
    body: JSON.stringify({ action, payload }),
  })
  let data = {}
  try { data = await res.json() } catch { /* réponse non JSON */ }
  if (res.status === 401) {
    sessionStorage.removeItem('admin_auth')
    sessionStorage.removeItem('admin_key')
  }
  if (!res.ok || data.success === false) throw new Error(data.error || 'Erreur admin')
  return data.data
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
  await adminCall('update_produit', { slug, data })
}

// ── RÉALISATIONS ──────────────────────────────────────────────────────────────
export async function getRealisations(onlyActifs = false) {
  // L'admin voit aussi les réalisations masquées (la RLS publique les cache)
  if (!onlyActifs) return adminCall('list_realisations')
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
  return adminCall('add_realisation', { data })
}

export async function updateRealisation(id, data) {
  await adminCall('update_realisation', { id, data })
}

export async function deleteRealisation(id) {
  await adminCall('delete_realisation', { id })
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
  await adminCall('update_variante', { id, data })
}

export async function addVariante(data) {
  return adminCall('add_variante', { data })
}

export async function deleteVariante(id) {
  await adminCall('delete_variante', { id })
}

// ── DEMANDES DEVIS ────────────────────────────────────────────────────────────
export async function addDemandeDevis(data) {
  // Pas de .select() : la policy RLS n'autorise que l'INSERT pour anon,
  // pas la relecture de la ligne insérée.
  const { error } = await supabase.from('demandes_devis').insert(data)
  if (error) throw error
}

export async function getDemandes() {
  return adminCall('list_leads', { table: 'demandes_devis' })
}

export async function updateDemandeStatut(id, statut) {
  await adminCall('update_lead_statut', { table: 'demandes_devis', id, statut })
}

// ── MESSAGES CONTACT ──────────────────────────────────────────────────────────
export async function addMessageContact(data) {
  // Pas de .select() : la policy RLS n'autorise que l'INSERT pour anon,
  // pas la relecture de la ligne insérée.
  const { error } = await supabase.from('messages_contact').insert(data)
  if (error) throw error
}

export async function getMessages() {
  return adminCall('list_leads', { table: 'messages_contact' })
}

export async function updateMessageStatut(id, statut) {
  await adminCall('update_lead_statut', { table: 'messages_contact', id, statut })
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
  await adminCall('update_parametre', { cle, valeur })
}
