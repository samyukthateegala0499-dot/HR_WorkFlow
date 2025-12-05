// src/utils/simulate.js

/**
 * Simulates execution of a React Flow diagram.
 * It starts from the Start Node and walks through all outgoing edges.
 *
 * @param {Array} nodes - All flow nodes
 * @param {Array} edges - All flow edges
 * @returns {Array} - List of steps (execution log)
 */

export function simulateFlow(nodes, edges) {
  const log = [];

  // 1. Find the Start Node
  const startNode = nodes.find(n => n.type === "startNode");
  if (!startNode) {
    return ["❌ No Start Node found. Simulation aborted."];
  }

  log.push(`🟢 Start → ${startNode.data?.title || "Start"}`);

  // 2. Traverse from start
  let currentNode = startNode;

  while (currentNode) {
    const nextEdge = edges.find(e => e.source === currentNode.id);

    if (!nextEdge) {
      log.push(`⛔ No outgoing edge from ${currentNode.data?.title}.`);
      break;
    }

    const nextNode = nodes.find(n => n.id === nextEdge.target);

    if (!nextNode) {
      log.push(`❌ Broken link → Node not found: ${nextEdge.target}`);
      break;
    }

    switch (nextNode.type) {
      case "actionNode":
        log.push(`⚙️ Action → ${nextNode.data?.label || "Action"}`);
        break;

      case "conditionNode":
        log.push(`🔀 Condition → ${nextNode.data?.label || "Condition"}`);
        break;

      case "endNode":
        log.push(`🔴 End → ${nextNode.data?.label || "End"}`);
        currentNode = null;
        continue;

      default:
        log.push(`📌 Node (${nextNode.type}) → ${nextNode.data?.label || "Node"}`);
        break;
    }

    currentNode = nextNode;
  }

  return log;
}
