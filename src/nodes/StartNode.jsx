import React from 'react'
import { Handle, Position } from 'reactflow'

export default function StartNode({ data }) {
  return (
    <div style={{ padding:8, borderRadius:8, background:'#e6ffef', border:'1px solid #bfeecf' }}>
      <strong>{data.title || 'Start'}</strong>
      <div className="small">{data?.description || "start Node Description"}</div>

      <Handle type="source" position={Position.Bottom} id="a" style={{ background:'#555' }} />
    </div>
  )
}
