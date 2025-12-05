export function serializeWorkflow(nodes, edges) {
  return {
    nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data, position: n.position })),
    edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target }))
  }
}
