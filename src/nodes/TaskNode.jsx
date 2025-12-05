// src/nodes/TaskNode.jsx
import React from 'react'
import { Handle, Position } from 'reactflow'

export default function TaskNode({ data }) {
  return (
    <div style={{ padding:8, borderRadius:8, background:'#fff', border:'1px solid #e6e9ef' }}>
      <strong>{data.title || 'Task'}</strong>
      <div className="small">{data.description}</div>

      <Handle type="target" position={Position.Top} id="t" style={{ background:'#555' }} />
      <Handle type="source" position={Position.Bottom} id="s" style={{ background:'#555' }} />
    </div>
  )
}
