import { useRef } from 'react'
import SwipeIndicator from '../meal/SwipeIndicator'

const SWIPE_RANGE = 5
const CENTER_INDEX = 2
const MIN_OFFSET = -CENTER_INDEX
const MAX_OFFSET = SWIPE_RANGE - 1 - CENTER_INDEX

export default function WeekSwiper({ weekOffset, onChangeOffset, children }) {
  const touchStartRef = useRef(null)

  const goPrev = () => {
    if (weekOffset > MIN_OFFSET) onChangeOffset(weekOffset - 1)
  }
  const goNext = () => {
    if (weekOffset < MAX_OFFSET) onChangeOffset(weekOffset + 1)
  }
  const goThis = () => onChangeOffset(0)

  const onTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartRef.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartRef.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev()
      else goNext()
    }
    touchStartRef.current = null
  }

  const indicatorIndex = Math.min(
    Math.max(weekOffset + CENTER_INDEX, 0),
    SWIPE_RANGE - 1
  )

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8">
      <button
        onClick={goPrev}
        disabled={weekOffset <= MIN_OFFSET}
        className="absolute inset-y-0 -left-14 hidden md:flex items-center justify-center text-text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-text-muted"
        aria-label="이전 주"
      >
        <span className="material-symbols-outlined text-4xl">chevron_left</span>
      </button>
      <button
        onClick={goNext}
        disabled={weekOffset >= MAX_OFFSET}
        className="absolute inset-y-0 -right-14 hidden md:flex items-center justify-center text-text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-text-muted"
        aria-label="다음 주"
      >
        <span className="material-symbols-outlined text-4xl">chevron_right</span>
      </button>

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {children}
      </div>

      <SwipeIndicator total={SWIPE_RANGE} current={indicatorIndex} />

      {weekOffset !== 0 && (
        <div className="flex justify-center">
          <button
            onClick={goThis}
            className="mt-6 flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">today</span>
            이번 주로 돌아가기
          </button>
        </div>
      )}
    </div>
  )
}
