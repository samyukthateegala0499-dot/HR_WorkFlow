// src/mocks/handlers.js
import { http, HttpResponse } from 'msw'

const automations = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] }
]

function simulateNodes(nodes = [], edges = []) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const adj = new Map()
  edges.forEach(e => adj.set(e.source, (adj.get(e.source) || []).concat(e.target)))

  const startNodes = nodes.filter(n => n.type === 'start')
  if (startNodes.length === 0) return { ok: false, error: 'No start node' }
  if (startNodes.length > 1) return { ok: false, error: 'Multiple start nodes' }

  const start = startNodes[0]
  const visited = new Set()
  const q = [start.id]
  const steps = []

  while (q.length) {
    const id = q.shift()
    if (visited.has(id)) continue
    visited.add(id)
    const node = nodeMap.get(id)
    if (!node) continue
    steps.push({ nodeId: id, type: node.type, message: `Executing ${node.type} (${node.data?.title || ''})` })

    if (node.type === 'approval') {
      steps.push({ nodeId: id, type: 'approval', message: `Pending approval by ${node.data?.approverRole || 'Manager'}` })
      steps.push({ nodeId: id, type: 'approval', message: `Approved` })
    }

    if (node.type === 'automated') {
      const action = automations.find(a => a.id === node.data?.actionId)
      steps.push({ nodeId: id, type: 'automated', message: `Action: ${action?.label || 'Unknown'}` })
    }

    const nexts = adj.get(id) || []
    q.push(...nexts)
  }

  steps.push({ nodeId: 'END', type: 'end', message: 'Simulation complete' })
  return { ok: true, steps }
}

export const handlers = [
  http.get('/automations', () => HttpResponse.json(automations)),

  http.post('/simulate', async ({ request }) => {
    const body = await request.json()
    const nodes = body.nodes || []
    const edges = body.edges || []

    const startCount = nodes.filter(n => n.type === 'start').length
    if (startCount === 0) return HttpResponse.json({ ok: false, error: 'No Start node' })
    if (startCount > 1) return HttpResponse.json({ ok: false, error: 'Multiple Start nodes' })

    // basic cycle detection (DFS)
    const nodeSet = new Set(nodes.map(n => n.id))
    const adjLocal = new Map()
    edges.forEach(e => adjLocal.set(e.source, (adjLocal.get(e.source) || []).concat(e.target)))
    let hasCycle = false
    const visiting = new Set()
    const visited = new Set()
    function dfs(u) {
      if (visiting.has(u)) { hasCycle = true; return }
      if (visited.has(u)) return
      visiting.add(u)
      ;(adjLocal.get(u) || []).forEach(v => { if (nodeSet.has(v)) dfs(v) })
      visiting.delete(u)
      visited.add(u)
    }
    const start = nodes.find(n => n.type === 'start')
    if (start) dfs(start.id)
    if (hasCycle) return HttpResponse.json({ ok: false, error: 'Cycle detected' })

    const result = simulateNodes(nodes, edges)
    return HttpResponse.json(result)
  })
]
