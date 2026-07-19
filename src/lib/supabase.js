import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const urlMissing = !supabaseUrl || supabaseUrl.includes('votre-projet')
const keyMissing = !supabaseKey || supabaseKey.includes('votre-cle')

if (urlMissing || keyMissing) {
  console.warn(
    '\n%c[JO Prime] ⚠️  Variables Supabase non configurées\n\n' +
    'Ouvrez le fichier .env et renseignez :\n' +
    '  VITE_SUPABASE_URL   → Project URL dans Supabase > Settings > API\n' +
    '  VITE_SUPABASE_ANON_KEY → anon / public key\n\n' +
    'Puis relancez : npm run dev\n',
    'color: orange; font-weight: bold'
  )
}

// On crée quand même le client pour éviter le crash au chargement.
// Les appels échoueront proprement si les clés sont invalides.
export const supabase = createClient(
  urlMissing ? 'https://placeholder.supabase.co' : supabaseUrl,
  keyMissing ? 'placeholder-key-configure-env-file' : supabaseKey
)
