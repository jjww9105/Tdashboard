import { useEffect, useRef } from 'react'
import { WAKE_LOCK_START_HOUR, WAKE_LOCK_END_HOUR } from '../constants'

function isWithinActiveHours() {
  const hour = new Date().getHours()
  return hour >= WAKE_LOCK_START_HOUR && hour < WAKE_LOCK_END_HOUR
}

export function useWakeLock() {
  const wakeLockRef = useRef(null)

  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) return
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen')
    } catch {
      // 브라우저 미지원 또는 거부 시 무시
    }
  }

  async function releaseWakeLock() {
    try {
      await wakeLockRef.current?.release()
      wakeLockRef.current = null
    } catch {
      // 무시
    }
  }

  useEffect(() => {
    function check() {
      if (isWithinActiveHours()) {
        if (!wakeLockRef.current) requestWakeLock()
      } else {
        releaseWakeLock()
      }
    }

    check()
    const interval = setInterval(check, 60_000)

    // 탭이 다시 보일 때 재획득
    function onVisibilityChange() {
      if (document.visibilityState === 'visible' && isWithinActiveHours()) {
        requestWakeLock()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      releaseWakeLock()
    }
  }, [])
}
