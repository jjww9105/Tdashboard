import { useState, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    try {
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      // localStorage 용량 초과 등 무시
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    try {
      window.localStorage.removeItem(key)
    } catch {
      // 무시
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
