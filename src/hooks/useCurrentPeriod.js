import { useEffect, useState } from 'react'
import { getCurrentPeriod } from '../utils/periodCalc'

export function useCurrentPeriod(periodTimes, lessonDurationMin) {
  const [current, setCurrent] = useState(() =>
    getCurrentPeriod(new Date(), periodTimes, lessonDurationMin)
  )

  useEffect(() => {
    if (!Array.isArray(periodTimes) || periodTimes.length === 0) {
      setCurrent(null)
      return
    }

    const tick = () => {
      setCurrent(getCurrentPeriod(new Date(), periodTimes, lessonDurationMin))
    }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [periodTimes, lessonDurationMin])

  return current
}
