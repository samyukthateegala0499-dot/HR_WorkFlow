import React, { useEffect, useState } from 'react'
import { useWorkflow } from '../hooks/useWorkflowState.jsx'
import useAutomations from '../hooks/useAutomationActions.js'
import '../PropertiesPanel.css'

export default function PropertiesPanel() {
  const { nodes, selectedNodeId, setNodeData } = useWorkflow()
  const actions = useAutomations()
  const [local, setLocal] = useState(null)

  useEffect(() => {
    if (!selectedNodeId) { setLocal(null); return }
    const node = nodes.find(n => n.id === selectedNodeId)
    if (node) setLocal({ ...node.data, _type: node.type })
  }, [selectedNodeId, nodes])

  if (!local) return (
    <div className="panelContainer empty">
      <h4 className="panelTitle">Node Properties</h4>
      <div className="panelHint">Select a node on the canvas to edit</div>
    </div>
  )

  function update(key, value) {
    setLocal(prev => ({ ...prev, [key]: value }))
  }

  function save() {
    setNodeData(selectedNodeId, local)
  }

  return (
    <div className="panelContainer">
      <h4 className="panelTitle">Node Properties</h4>

      <div className="propertyCard">
        <div className="formRow">
          <label>Title</label>
          <input 
            className="inputField"
            value={local.title || ''}
            onChange={e => update('title', e.target.value)}
          />
        </div>

        {local._type === "start" && (
  <div className="formRow">
    <label>Metadata (JSON)</label>

    <textarea
      className="inputField"
      value={local._metadataText}
      onChange={(e) => {
        update("_metadataText", e.target.value); 
      }}
      onBlur={() => {
        try {
          const parsed = JSON.parse(local._metadataText);
          update("metadata", parsed); 
        } catch {
          alert("Invalid JSON format! Please fix it.");
        }
      }}
    />
    </div>
        )}


        {local._type === 'task' && (
          <>
            <div className="formRow"><label>Description</label><input className="inputField" value={local.description || ''} onChange={e => update('description', e.target.value)} /></div>
            <div className="formRow"><label>Assignee</label><input className="inputField" value={local.assignee || ''} onChange={e => update('assignee', e.target.value)} /></div>
            <div className="formRow"><label>Due Date</label><input className="inputField" type="date" value={local.dueDate || ''} onChange={e => update('dueDate', e.target.value)} /></div>
          </>
        )}

        {local._type === 'approval' && (
          <>
            <div className="formRow"><label>Approver Role</label><input className="inputField" value={local.approverRole || ''} onChange={e => update('approverRole', e.target.value)} /></div>
            <div className="formRow"><label>Auto-approve Threshold</label><input className="inputField" type="number" value={local.autoApproveThreshold || 0} onChange={e => update('autoApproveThreshold', Number(e.target.value))} /></div>
          </>
        )}

        {local._type === 'automated' && (
          <>
            <div className="formRow">
              <label>Action</label>
              <select className="inputField" value={local.actionId || ''} onChange={e => update('actionId', e.target.value)}>
                <option value="">-- Select action --</option>
                {actions.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>

            {actions.find(a => a.id === local.actionId)?.params?.map(p => (
              <div className="formRow" key={p}>
                <label>{p}</label>
                <input 
                  className="inputField"
                  value={(local.actionParams?.[p]) || ''}
                  onChange={e => update('actionParams', { ...(local.actionParams || {}), [p]: e.target.value })}
                />
              </div>
            ))}
          </>
        )}

        {local._type === 'end' && (
          <>
            <div className="formRow"><label>End Message</label><input className="inputField" value={local.endMessage || ''} onChange={e => update('endMessage', e.target.value)} /></div>

            <div className="formRow checkboxRow">
              <input type="checkbox" checked={!!local.summary} onChange={e => update('summary', e.target.checked)} />
              <label>Include Summary</label>
            </div>
          </>
        )}

        <button className="saveButton" onClick={save}>Save</button>
      </div>
    </div>
  )
}
