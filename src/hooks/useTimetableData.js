import { useState, useEffect, useRef } from 'react'
import { getMondayOfWeek, getFridayOfWeek, formatYYYYMMDD } from '../utils/weekUtils'
import { loadTimetableWeek } from '../utils/supabase'

const CACHE_TTL_MS = 60 * 60 * 1000
const cache = new Map()

function buildKey(setting, weekOffset) {
  return `${setting.sourcePreference || 'neis'}-${setting.schoolCode}-${setting.grade}-${setting.classNo}-${weekOffset}`
}

function isFresh(entry) {
  if (!entry) return false
  const now = Date.now()
  if (now - entry.savedAt > CACHE_TTL_MS) return false
  const savedMonday = getMondayOfWeek(new Date(entry.savedAt))
  const currentMonday = getMondayOfWeek(new Date(now))
  if (savedMonday.getTime() !== currentMonday.getTime()) return false
  return true
}

export function useTimetableData(setting, weekOffset = 0) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [empty, setEmpty] = useState(false)
  const abortRef = useRef(null)

  useEffect(() => {
    if (!setting?.schoolCode || setting.grade == null || setting.classNo == null) {
      setData([])
      setEmpty(false)
      setError(null)
      return
    }

    const key = buildKey(setting, weekOffset)
    const cached = cache.get(key)
    if (isFresh(cached)) {
      setData(cached.data)
      setEmpty(cached.empty)
      setError(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)

    const today = new Date()
    const monday = getMondayOfWeek(today, weekOffset)
    const friday = getFridayOfWeek(today, weekOffset)
    const fromDate = formatYYYYMMDD(monday)
    const toDate = formatYYYYMMDD(friday)

    const run = async () => {
      try {
        if (setting.sourcePreference === 'supabase') {
          const rows = await loadTimetableWeek(setting.schoolCode, setting.grade, setting.classNo)
          if (controller.signal.aborted) return
          cache.set(key, { data: rows, empty: rows.length === 0, savedAt: Date.now() })
          setData(rows)
          setEmpty(rows.length === 0)
          return
        }

        const params = new URLSearchParams({
          educationOfficeCode: setting.educationOfficeCode,
          schoolCode: setting.schoolCode,
          grade: String(setting.grade),
          classNo: String(setting.classNo),
          fromDate,
          toDate,
        })
        const res = await fetch(`/api/timetable?${params}`, { signal: controller.signal })
        if (!res.ok) throw new Error('API 오류')
        const result = await res.json()
        if (controller.signal.aborted) return

        if (result.error) {
          setError(result.error)
          setData([])
          setEmpty(false)
          return
        }

        cache.set(key, {
          data: result.data || [],
          empty: Boolean(result.empty),
          savedAt: Date.now(),
        })
        setData(result.data || [])
        setEmpty(Boolean(result.empty))
      } catch (err) {
        if (err.name === 'AbortError') return
        setError('시간표를 불러올 수 없습니다.')
        setData([])
        setEmpty(false)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    run()

    return () => controller.abort()
  }, [
    setting?.schoolCode,
    setting?.grade,
    setting?.classNo,
    setting?.educationOfficeCode,
    setting?.sourcePreference,
    weekOffset,
  ])

  const invalidate = () => {
    if (!setting?.schoolCode) return
    const key = buildKey(setting, weekOffset)
    cache.delete(key)
  }

  const patchCell = (weekday, period, subject) => {
    if (!setting?.schoolCode) return
    const key = buildKey(setting, weekOffset)
    const current = cache.get(key)?.data || data
    const filtered = current.filter((r) => !(r.weekday === weekday && r.period === period))
    const next = subject ? [...filtered, { weekday, period, subject }] : filtered
    cache.set(key, { data: next, empty: next.length === 0, savedAt: Date.now() })
    setData(next)
    setEmpty(next.length === 0)
  }

  return { data, isLoading, error, empty, invalidate, patchCell }
}
