import { createContext, useContext, useState, useCallback } from "react";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

export const WorkflowContext = createContext(null);

export function WorkflowProvider({ children }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Add Node
  const addNode = useCallback((type, position) => {
    const id = crypto.randomUUID();
    const newNode = {
      id,
      type,
      position,
      data: { label: `${type} node`, config: {} },
    };
    setNodes((nds) => [...nds, newNode]);
  }, []);

  // Update node data (FIX FOR YOUR ERROR)
  const setNodeData = useCallback((id, newData) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, []);

  // Connect edges
  const connect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  // React Flow node change handler
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // React Flow edge change handler
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const value = {
    nodes,
    setNodes,
    edges,
    setEdges,
    addNode,
    connect,
    onNodesChange,
    onEdgesChange,
    selectedNodeId,
    setSelectedNodeId,
    setNodeData,   // ⭐ FIXED
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx)
    throw new Error("useWorkflow must be used inside WorkflowProvider");
  return ctx;
}
