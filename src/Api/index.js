export async function fetchAutomations() {
  const r = await fetch('/automations')
  if (!r.ok) throw new Error('Failed to fetch automations')
  return r.json()
}

export async function postSimulate(payload) {
  const r = await fetch('/simulate', {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify(payload)
  })
  if (!r.ok) throw new Error('Simulation failed')
  return r.json()
}
