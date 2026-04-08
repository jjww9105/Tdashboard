import { useState, useEffect, useRef } from 'react'
import { formatDateYYYYMMDD } from '../utils/dateUtils'

const cache = new Map()

export function useMealData(school, date) {
  const [data, setData] = useState({ menu: [], calorie: null })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => {
    if (!school) return

    const dateStr = formatDateYYYYMMDD(date)
    const cacheKey = `${school.schoolCode}_${dateStr}`

    if (cache.has(cacheKey)) {
      setData(cache.get(cacheKey))
      setError(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)

    const params = new URLSearchParams({
      educationOfficeCode: school.educationOfficeCode,
      schoolCode: school.schoolCode,
      date: dateStr,
    })

    fetch(`/api/meal?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('API 오류')
        return res.json()
      })
      .then((result) => {
        cache.set(cacheKey, result)
        setData(result)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('급식 데이터를 불러올 수 없습니다.')
          setData({ menu: [], calorie: null })
        }
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [school, date])

  return { data, isLoading, error }
}
