import { DEFAULT_LESSON_MIN } from '../constants'

function parseHHMM(hhmm) {
  if (typeof hhmm !== 'string') return null
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (h < 0 || h > 23 || min < 0 || min > 59) return null
  return h * 60 + min
}

export function getCurrentPeriod(now, periodTimes, lessonDurationMin) {
  if (!Array.isArray(periodTimes) || periodTimes.length === 0) return null
  const day = now.getDay()
  if (day === 0 || day === 6) return null
  const weekday = day

  const nowMin = now.getHours() * 60 + now.getMinutes()
  const duration =
    typeof lessonDurationMin === 'number' && lessonDurationMin > 0
      ? lessonDurationMin
      : DEFAULT_LESSON_MIN

  for (const entry of periodTimes) {
    if (!entry) continue
    const start = parseHHMM(entry.startTime)
    if (start == null) continue
    const end = start + duration
    if (nowMin >= start && nowMin < end) {
      return { weekday, period: entry.period }
    }
  }
  return null
}
