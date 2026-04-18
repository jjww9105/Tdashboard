import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEY_TEACHER_AUTH } from '../constants'

export function useTeacherAuth() {
  const [auth, setAuth, removeAuth] = useLocalStorage(
    STORAGE_KEY_TEACHER_AUTH,
    null
  )

  const hasPin = Boolean(auth?.pin)

  const verifyPin = useCallback((input) => auth?.pin === input, [auth])

  const createPin = useCallback(
    (pin, hint) => {
      setAuth({ pin, pinHint: (hint || '').trim() })
    },
    [setAuth]
  )

  const getHint = useCallback(() => auth?.pinHint || '', [auth])

  const clearPin = useCallback(() => {
    removeAuth()
  }, [removeAuth])

  return { hasPin, verifyPin, createPin, getHint, clearPin }
}
