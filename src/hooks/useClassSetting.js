import { useCallback, useEffect, useRef } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEY_CLASS_SETTING } from '../constants'
import { loadClassSetting, saveClassSetting } from '../utils/supabase'

export function useClassSetting() {
  const [setting, setSetting, removeSetting] = useLocalStorage(
    STORAGE_KEY_CLASS_SETTING,
    null
  )
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    if (setting) return

    loadClassSetting().then((remote) => {
      if (remote) setSetting(remote)
    })
  }, [setting, setSetting])

  const updateSetting = useCallback(
    (updates) => {
      const next = { ...(setting || {}), ...updates }
      setSetting(next)
      saveClassSetting(next)
      return next
    },
    [setting, setSetting]
  )

  const clearSetting = useCallback(() => {
    removeSetting()
  }, [removeSetting])

  const isConfigured = Boolean(
    setting?.schoolCode && setting?.grade != null && setting?.classNo != null
  )

  return { setting, updateSetting, clearSetting, isConfigured }
}
