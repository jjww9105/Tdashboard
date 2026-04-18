import { useState, useCallback, useEffect } from 'react'

const SYNC_EVENT = 'softcloud:localstorage-sync'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.key === key) setStoredValue(e.detail.value)
    }
    window.addEventListener(SYNC_EVENT, handler)
    return () => window.removeEventListener(SYNC_EVENT, handler)
  }, [key])

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    try {
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      // localStorage 용량 초과 등 무시
    }
    window.dispatchEvent(
      new CustomEvent(SYNC_EVENT, { detail: { key, value: valueToStore } })
    )
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    try {
      window.localStorage.removeItem(key)
    } catch {
      // 무시
    }
    window.dispatchEvent(
      new CustomEvent(SYNC_EVENT, { detail: { key, value: initialValue } })
    )
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
