import React, { useEffect, useState } from 'react'
import { fetchAutomations } from '../Api'

export default function NodeFormPanel({ selectedNode }) {
  const [local, setLocal] = useState(null)
  const [actions, setActions] = useState([])

  useEffect(() => {
    if (!selectedNode) { setLocal(null); return }
    setLocal(selectedNode.data ? { ...selectedNode.data } : {})
  }, [selectedNode])

  useEffect(() => {
    fetchAutomations().then(setActions).catch(() => setActions([]))
  }, [])

  if (!selectedNode) {
    return <div><h4 className="sectionTitle">Node Settings</h4><div className="small">Select a node to edit</div></div>
  }

  function updateField(key, value) {
    setLocal(prev => ({ ...prev, [key]: value }))
  }

  function save() {
    // push update to canvas via global helper set by FlowCanvas
    if (window.__setNodeData) window.__setNodeData(selectedNode.id, local)
  }

  return (
    <div>
      <h4 className="sectionTitle">Edit: {selectedNode.type}</h4>
      <div className="nodeCard">
        <div className="formRow">
          <label>Title</label>
          <input className="input" value={local?.title || ''} onChange={e => updateField('title', e.target.value)} />
        </div>

        {selectedNode.type === 'start' && (
          <>
            <div className="formRow">
              <label>Metadata (key)</label>
              <input className="input" value={local?.metadata?.key || ''} onChange={e => updateField('metadata', { ...(local.metadata || {}), key: e.target.value })} />
            </div>
          </>
        )}

        {selectedNode.type === 'task' && (
          <>
            <div className="formRow"><label>Description</label><input className="input" value={local?.description || ''} onChange={e => updateField('description', e.target.value)} /></div>
            <div className="formRow"><label>Assignee</label><input className="input" value={local?.assignee || ''} onChange={e => updateField('assignee', e.target.value)} /></div>
            <div className="formRow"><label>Due date</label><input className="input" value={local?.dueDate || ''} onChange={e => updateField('dueDate', e.target.value)} /></div>
          </>
        )}

        {selectedNode.type === 'approval' && (
          <>
            <div className="formRow"><label>Approver role</label><input className="input" value={local?.approverRole || ''} onChange={e => updateField('approverRole', e.target.value)} /></div>
            <div className="formRow"><label>Auto-approve threshold</label><input className="input" type="number" value={local?.autoApproveThreshold || 0} onChange={e => updateField('autoApproveThreshold', Number(e.target.value))} /></div>
          </>
        )}

        {selectedNode.type === 'automated' && (
          <>
            <div className="formRow">
              <label>Action</label>
              <select className="input" value={local?.actionId || ''} onChange={e => updateField('actionId', e.target.value)}>
                <option value="">-- select action --</option>
                {actions.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
            {actions.find(a => a.id === local?.actionId)?.params?.map(p => (
              <div className="formRow" key={p}>
                <label>{p}</label>
                <input className="input" value={local?.actionParams?.[p] || ''} onChange={e => updateField('actionParams', { ...(local.actionParams || {}), [p]: e.target.value })} />
              </div>
            ))}
          </>
        )}

        {selectedNode.type === 'end' && (
          <>
            <div className="formRow"><label>End message</label><input className="input" value={local?.endMessage || ''} onChange={e => updateField('endMessage', e.target.value)} /></div>
            <div className="formRow"><label><input type="checkbox" checked={!!local?.summary} onChange={e => updateField('summary', e.target.checked)} /> Show summary</label></div>
          </>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="button" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}
