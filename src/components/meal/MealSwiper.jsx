import { useState, useRef, useCallback, useEffect } from 'react'
import { addDays, isToday } from '../../utils/dateUtils'
import { useMealData } from '../../hooks/useMealData'
import PageTitle from '../common/PageTitle'
import MealCard from './MealCard'
import SwipeIndicator from './SwipeIndicator'

const SWIPE_RANGE = 7 // 오늘 기준 ±3일 = 7개 dot

function dayOffset(date) {
  const today = new Date()
  const diff = Math.round((date - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000)
  return diff
}

export default function MealSwiper({ school }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const touchStartRef = useRef(null)

  const { data, isLoading } = useMealData(school, currentDate)

  // 자정 자동 갱신: 날짜가 바뀌면 오늘로 리셋
  useEffect(() => {
    function checkDateChange() {
      const now = new Date()
      if (!isToday(currentDate)) return
      // 자정 직후 날짜가 바뀌었으면 오늘로 리셋
      setCurrentDate((prev) => {
        const prevDay = prev.getDate()
        const nowDay = now.getDate()
        if (prevDay !== nowDay) return new Date()
        return prev
      })
    }
    const interval = setInterval(checkDateChange, 60_000)
    return () => clearInterval(interval)
  }, [currentDate])

  const goToPrev = useCallback(() => {
    setCurrentDate((d) => addDays(d, -1))
  }, [])

  const goToNext = useCallback(() => {
    setCurrentDate((d) => addDays(d, 1))
  }, [])

  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  function onTouchStart(e) {
    touchStartRef.current = e.touches[0].clientX
  }

  function onTouchEnd(e) {
    if (touchStartRef.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartRef.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToPrev()
      else goToNext()
    }
    touchStartRef.current = null
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <PageTitle title="오늘의 급식" date={currentDate} />

      <div className="relative w-full max-w-2xl mx-auto mt-8">
        {/* PC용 좌우 화살표 */}
        <button
          onClick={goToPrev}
          className="absolute inset-y-0 -left-14 hidden md:flex items-center justify-center text-text-muted hover:text-primary transition-colors"
          aria-label="이전 날짜"
        >
          <span className="material-symbols-outlined text-4xl">chevron_left</span>
        </button>
        <button
          onClick={goToNext}
          className="absolute inset-y-0 -right-14 hidden md:flex items-center justify-center text-text-muted hover:text-primary transition-colors"
          aria-label="다음 날짜"
        >
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
        </button>

        {/* 스와이프 영역 */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {isLoading ? (
            <div className="bg-card rounded-[40px] shadow-soft-pink p-10 md:p-16 flex items-center justify-center min-h-[300px]">
              <p className="text-2xl font-bold text-text-muted animate-pulse">
                불러오는 중...
              </p>
            </div>
          ) : (
            <MealCard menu={data.menu} calorie={data.calorie} />
          )}
        </div>

        {/* 스와이프 인디케이터 */}
        <SwipeIndicator
          total={SWIPE_RANGE}
          current={Math.min(Math.max(dayOffset(currentDate) + 3, 0), SWIPE_RANGE - 1)}
        />

        {/* 오늘로 돌아가기 버튼 */}
        {!isToday(currentDate) && (
          <button
            onClick={goToToday}
            className="mt-6 mx-auto flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">today</span>
            오늘로 돌아가기
          </button>
        )}
      </div>
    </div>
  )
}
