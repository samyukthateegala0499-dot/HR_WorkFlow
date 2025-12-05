// src/nodes/AutomatedNode.jsx
import React from 'react'
import { Handle, Position } from 'reactflow'

export default function AutomatedNode({ data }) {
  return (
    <div style={{ padding:8, borderRadius:8, background:'#eef6ff', border:'1px solid #d6e6ff' }}>
      <strong>{data.title || 'Automated'}</strong>
      <div className="small">{data.actionId}</div>

      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Bottom} id="s" />
    </div>
  )
}
