const inDegree = new Map(nodes.map(n => [n.id, 0]))
  edges.forEach(e => inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1))
  const queue = []
  for (const [id, deg] of inDegree) if (deg === 0) queue.push(id)
  const out = new Map()
  edges.forEach(e => out.set(e.source, (out.get(e.source) || []).concat(e.target)))
  let cnt = 0
  while (queue.length) {
    const u = queue.shift()
    cnt++
    (out.get(u) || []).forEach(v => {
      inDegree.set(v, inDegree.get(v) - 1)
      if (inDegree.get(v) === 0) queue.push(v)
    })
  }
  if (cnt !== nodes.length) errors.push('Cycle or disconnected nodes detected')

  return errors
