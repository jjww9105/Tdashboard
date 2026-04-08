import { useState, useEffect, useRef } from 'react'
import { SCHOOL_SEARCH_DEBOUNCE_MS, SCHOOL_SEARCH_MIN_LENGTH } from '../constants'

export function useSchoolSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)

    if (query.length < SCHOOL_SEARCH_MIN_LENGTH) {
      setResults([])
      return
    }

    timerRef.current = setTimeout(() => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setIsLoading(true)

      fetch(`/api/school?query=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setResults(data.schools || []))
        .catch((err) => {
          if (err.name !== 'AbortError') setResults([])
        })
        .finally(() => setIsLoading(false))
    }, SCHOOL_SEARCH_DEBOUNCE_MS)

    return () => {
      clearTimeout(timerRef.current)
      abortRef.current?.abort()
    }
  }, [query])

  return { query, setQuery, results, isLoading }
}
