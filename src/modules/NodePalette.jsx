import React from 'react'

const items = [
  { type: 'start', label: 'Start' },
  { type: 'task', label: 'Task' },
  { type: 'approval', label: 'Approval' },
  { type: 'automated', label: 'Automated' },
  { type: 'end', label: 'End' }
]

export default function NodePalette() {
  function onDragStart(e, type) {
    e.dataTransfer.setData('application/reactflow', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div>
      <h4 className="sectionTitle">Nodes</h4>
      {items.map(i => (
        <div key={i.type} className="paletteItem" draggable onDragStart={(e) => onDragStart(e, i.type)}>
          {i.label}
        </div>
      ))}
      <div style={{ marginTop: 12 }} className="small">Drag a node onto the canvas</div>
    </div>
  )
}
