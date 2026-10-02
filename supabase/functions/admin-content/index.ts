import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Secret à définir : Supabase → Edge Functions → Secrets → ADMIN_KEY
const ADMIN_KEY = Deno.env.get('ADMIN_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-admin-key',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

function respond(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
const ok = (data?: unknown) => respond({ success: true, data })
const fail = (error: string, status = 400) => respond({ success: false, error }, status)

// Comparaison en temps constant
function safeEqual(a: string, b: string) {
  const enc = new TextEncoder()
  const x = enc.encode(a)
  const y = enc.encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}

// ── Validation ────────────────────────────────────────────────────────────
type Rule = 'text' | 'int' | 'bool' | 'image' | 'slug'
const FIELDS: Record<string, Record<string, Rule>> = {
  produits: { nom: 'text', tagline: 'text', description: 'text', image_url: 'image', actif: 'bool' },
  realisations: { titre: 'text', categorie: 'text', description: 'text', image_url: 'image', actif: 'bool', ordre: 'int' },
  variantes: { produit_slug: 'slug', nom: 'text', specs: 'text', prix: 'int', unite: 'text', delai: 'text', populaire: 'bool', ordre: 'int' },
}
const MAX_TEXT = 2000
const MAX_IMAGE = 3_000_000
const IMAGE_RE = /^(data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+|https:\/\/[^\s"'<>]+)$/

function clean(table: string, data: unknown): Record<string, unknown> {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('données invalides')
  const spec = FIELDS[table]
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    const rule = spec[k]
    if (!rule) continue // champ non autorisé : ignoré
    if (v === null) { out[k] = null; continue }
    if (rule === 'text' || rule === 'slug') {
      if (typeof v !== 'string' || v.length > MAX_TEXT) throw new Error(`${k} invalide`)
    } else if (rule === 'int') {
      if (!Number.isInteger(v) || Math.abs(v as number) > 2_000_000_000) throw new Error(`${k} invalide`)
    } else if (rule === 'bool') {
      if (typeof v !== 'boolean') throw new Error(`${k} invalide`)
    } else if (rule === 'image') {
      if (typeof v !== 'string' || v.length > MAX_IMAGE || (v !== '' && !IMAGE_RE.test(v))) throw new Error('image invalide')
    }
    out[k] = v
  }
  return out
}

const PARAMS: Record<string, (v: string) => boolean> = {
  telephone: v => v.length <= 40,
  whatsapp: v => /^\d{0,20}$/.test(v),
  email: v => v === '' || /^[^\s@]{1,64}@[^\s@]{1,255}$/.test(v),
  adresse: v => v.length <= 200,
  horaires: v => v.length <= 200,
  facebook: v => v === '' || /^https:\/\/[^\s"'<>]{1,500}$/.test(v),
  instagram: v => v === '' || /^https:\/\/[^\s"'<>]{1,500}$/.test(v),
  afficher_prix: v => v === 'true' || v === 'false',
}

const LEAD_TABLES = ['demandes_devis', 'messages_contact']
const STATUTS = ['nouveau', 'en_cours', 'traite']
const isId = (v: unknown) => typeof v === 'string' && /^[0-9a-fA-F-]{36}$/.test(v)

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return fail('methode non supportee', 405)

  const adminKey = req.headers.get('x-admin-key') ?? ''
  if (!ADMIN_KEY || !adminKey || !safeEqual(adminKey, ADMIN_KEY)) {
    await new Promise(r => setTimeout(r, 800)) // ralentit le brute-force
    return fail('Non autorise', 401)
  }

  let action: string | undefined
  let payload: Record<string, unknown>
  try {
    const body = await req.json()
    action = body?.action
    payload = body?.payload ?? {}
  } catch {
    return fail('body JSON invalide', 400)
  }

  try {
    switch (action) {
      case 'login':
        return ok()

      // ── PRODUITS ────────────────────────────────────────────────────
      case 'update_produit': {
        const { slug, data } = payload as { slug?: string; data?: unknown }
        if (!slug || typeof slug !== 'string') return fail('parametres invalides')
        const { error } = await supabase.from('produits').update(clean('produits', data)).eq('slug', slug)
        if (error) throw error
        return ok()
      }

      // ── RÉALISATIONS ────────────────────────────────────────────────
      case 'list_realisations': {
        const { data, error } = await supabase
          .from('realisations').select('*')
          .order('ordre', { ascending: true })
          .order('created_at', { ascending: false })
        if (error) throw error
        return ok(data)
      }
      case 'add_realisation': {
        const { data: inserted, error } = await supabase
          .from('realisations').insert(clean('realisations', (payload as { data?: unknown }).data)).select().single()
        if (error) throw error
        return ok(inserted)
      }
      case 'update_realisation': {
        const { id, data } = payload as { id?: string; data?: unknown }
        if (!isId(id)) return fail('parametres invalides')
        const { error } = await supabase.from('realisations').update(clean('realisations', data)).eq('id', id)
        if (error) throw error
        return ok()
      }
      case 'delete_realisation': {
        const { id } = payload as { id?: string }
        if (!isId(id)) return fail('parametres invalides')
        const { error } = await supabase.from('realisations').delete().eq('id', id)
        if (error) throw error
        return ok()
      }

      // ── VARIANTES ───────────────────────────────────────────────────
      case 'update_variante': {
        const { id, data } = payload as { id?: string; data?: unknown }
        if (!isId(id)) return fail('parametres invalides')
        const { error } = await supabase.from('variantes').update(clean('variantes', data)).eq('id', id)
        if (error) throw error
        return ok()
      }
      case 'add_variante': {
        const { data: inserted, error } = await supabase
          .from('variantes').insert(clean('variantes', (payload as { data?: unknown }).data)).select().single()
        if (error) throw error
        return ok(inserted)
      }
      case 'delete_variante': {
        const { id } = payload as { id?: string }
        if (!isId(id)) return fail('parametres invalides')
        const { error } = await supabase.from('variantes').delete().eq('id', id)
        if (error) throw error
        return ok()
      }

      // ── PARAMÈTRES ──────────────────────────────────────────────────
      case 'update_parametre': {
        const { cle, valeur } = payload as { cle?: string; valeur?: string }
        const check = cle ? PARAMS[cle] : undefined
        if (!cle || !check || typeof valeur !== 'string' || !check(valeur)) return fail('parametre invalide')
        const { error } = await supabase.from('parametres_site').upsert({ cle, valeur }, { onConflict: 'cle' })
        if (error) throw error
        return ok()
      }

      // ── DEMANDES & MESSAGES ─────────────────────────────────────────
      case 'list_leads': {
        const { table } = payload as { table?: string }
        if (!table || !LEAD_TABLES.includes(table)) return fail('table invalide')
        const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false })
        if (error) throw error
        return ok(data)
      }
      case 'update_lead_statut': {
        const { table, id, statut } = payload as { table?: string; id?: string; statut?: string }
        if (!table || !LEAD_TABLES.includes(table) || !isId(id) || !statut || !STATUTS.includes(statut)) {
          return fail('parametres invalides')
        }
        const { error } = await supabase.from(table).update({ statut }).eq('id', id)
        if (error) throw error
        return ok()
      }

      // ── STORAGE (URL d'envoi signée, admin uniquement) ──────────────
      case 'get_upload_url': {
        const { path } = payload as { path?: string }
        if (!path || typeof path !== 'string' || path.length > 200 ||
            !/^[A-Za-z0-9_\-/.]+\.(jpe?g|png|webp|gif)$/i.test(path) || path.includes('..') || path.startsWith('/')) {
          return fail('parametres invalides')
        }
        const { data, error } = await supabase.storage.from('jo-prime-images').createSignedUploadUrl(path)
        if (error) throw error
        return ok({ signedUrl: data.signedUrl, token: data.token, path: data.path })
      }

      default:
        return fail('action invalide')
    }
  } catch (err) {
    console.error(err)
    return fail('Erreur serveur', 500)
  }
})
