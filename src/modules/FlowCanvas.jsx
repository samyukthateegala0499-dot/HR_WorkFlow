// src/modules/FlowCanvas.jsx
import React, { useRef, useCallback } from 'react'
import ReactFlow, { Background, Controls, MiniMap, MarkerType, useReactFlow } from 'reactflow'
import StartNode from '../nodes/StartNode.jsx'
import TaskNode from '../nodes/TaskNode.jsx'
import ApprovalNode from '../nodes/ApprovalNode.jsx'
import AutomatedNode from '../nodes/AutomatedNode.jsx'
import EndNode from '../nodes/EndNode.jsx'
import { useWorkflow } from '../hooks/useWorkflowState.jsx'

const nodeTypes = { start: StartNode, task: TaskNode, approval: ApprovalNode, automated: AutomatedNode, end: EndNode }

export default function FlowCanvas(){
  const reactFlowWrapper = useRef(null)
  const { nodes, edges, onNodesChange, onEdgesChange, addNode, connect, setSelectedNodeId, setNodes, setEdges } = useWorkflow()
  const rf = useReactFlow ? useReactFlow() : null

  // expose setNodes/setEdges via context already; PropertiesPanel/TestRunner read from context

  const onConnect = useCallback((params) => {
    connect({ ...params, markerEnd: { type: MarkerType.Arrow } })
  }, [connect])

  const onDrop = useCallback((event) => {
    event.preventDefault()
    const type = event.dataTransfer.getData('application/reactflow')
    if (!type) return
    const bounds = reactFlowWrapper.current.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    // react-flow's project gives correct coords; but use approximate position — good enough for prototype
    addNode(type, { x, y })
  }, [addNode])

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id)
  }, [setSelectedNodeId])

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  )
}
