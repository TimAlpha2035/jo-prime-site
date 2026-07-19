import { supabase } from './supabase'

export async function sendDevisEmail(data) {
  return supabase.functions.invoke('notify', { body: { type: 'devis', ...data } })
}

export async function sendContactEmail(data) {
  return supabase.functions.invoke('notify', { body: { type: 'contact', ...data } })
}
