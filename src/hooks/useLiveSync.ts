import { useEffect, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { TASKS_KEY } from './useTasks'

const SYNC_INTERVAL_MS = 15_000

export function useLiveSync() {
  const qc = useQueryClient()
  const [lastSync, setLastSync] = useState(() => new Date())

  const sync = useCallback(() => {
    qc.invalidateQueries({ queryKey: TASKS_KEY })
    setLastSync(new Date())
  }, [qc])

  useEffect(() => {
    const id = setInterval(sync, SYNC_INTERVAL_MS)
    return () => clearInterval(id)
  }, [sync])

  return lastSync
}
