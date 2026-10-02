// Remplacée par admin-content (actions list_leads / update_lead_statut).
// Conservée uniquement pour retirer l'ancien mot de passe en dur.
Deno.serve(() =>
  new Response(JSON.stringify({ error: 'Fonction retirée : utiliser admin-content' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
)
