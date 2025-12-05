// src/nodes/ApprovalNode.jsx
import React from 'react'
import { Handle, Position } from 'reactflow'

export default function ApprovalNode({ data }) {
  return (
    <div style={{ padding:8, borderRadius:8, background:'#fff7e6', border:'1px solid #f0d9b5' }}>
      <strong>{data.title || 'Approval'}</strong>
      <div className="small">{data.approverRole}</div>

      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Bottom} id="s" />
    </div>
  )
}
