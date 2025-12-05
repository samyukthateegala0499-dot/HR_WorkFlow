// src/modules/TestRunner.jsx
import React, { useState } from 'react'
import { useWorkflow } from '../hooks/useWorkflowState.jsx'
import { validateWorkflow } from '../utils/workflowValidation.js'
import { serializeWorkflow } from '../utils/graphHelpers.js'

export default function TestRunner(){
  const { nodes, edges, serialize, setNodes, setEdges } = useWorkflow()
  const [log, setLog] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    setError(null)
    setLog([])
    setLoading(true)
    try {
      const errors = validateWorkflow(nodes, edges)
      if (errors.length) { setError(errors.join('; ')); setLoading(false); return }
      const payload = serialize()
      const res = await fetch('/simulate', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!data.ok) setError(data.error || 'Simulation failed')
      else setLog(data.steps || [])
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  function exportJson() {
    const payload = serialize()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workflow.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        const nodesIn = (parsed.nodes || []).map(n => ({ id: n.id, type: n.type, position: n.position || {x:0,y:0}, data: n.data || {} }))
        const edgesIn = parsed.edges || []
        setNodes(nodesIn); setEdges(edgesIn)
      } catch {
        alert('Invalid JSON')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <h4 className="sectionTitle">Sandbox</h4>
      <div style={{display:'flex',gap:8}}>
        <button className="button" onClick={run} disabled={loading}>{loading ? 'Running...' : 'Simulate'}</button>
        <button className="button" onClick={exportJson}>Export</button>
        <label className="button" style={{cursor:'pointer'}}>Import
          <input type="file" accept=".json" style={{display:'none'}} onChange={e => importFile(e.target.files?.[0])} />
        </label>
      </div>

      {error && <div style={{color:'var(--danger)', marginTop:8}}>{error}</div>}

      <div className="log" style={{marginTop:8}}>
        {log.length === 0 ? <div className="small">No simulation run yet</div> : log.map((s,i) => <div key={i}><strong>{s.type}</strong>: {s.message}</div>)}
      </div>
    </div>
  )
}
