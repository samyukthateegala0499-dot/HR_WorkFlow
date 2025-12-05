// src/hooks/useAutomations.js
import { useEffect, useState } from 'react'

export default function useAutomations() {
  const [actions, setActions] = useState([])
  useEffect(() => {
    let mounted = true
    fetch('/automations')
      .then(r => r.json())
      .then(data => { if (mounted) setActions(data) })
      .catch(() => { if (mounted) setActions([]) })
    return () => { mounted = false }
  }, [])
  return actions
}
