// src/nodes/EndNode.jsx
import React from 'react'
import { Handle, Position } from 'reactflow'

export default function EndNode({ data }) {
  return (
    <div style={{ padding:8, borderRadius:8, background:'#fff0f6', border:'1px solid #f3d6e6' }}>
      <strong>{data.endMessage || 'End'}</strong>
      <div className="small">{data.endMessage}</div>

      <Handle type="target" position={Position.Top} id="t" />
    </div>
  )
}
