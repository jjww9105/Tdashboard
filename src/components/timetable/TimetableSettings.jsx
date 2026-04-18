import { useState } from 'react'
import { useClassSetting } from '../../hooks/useClassSetting'
import {
  MIN_PERIODS,
  MAX_PERIODS,
  DEFAULT_PERIODS,
  DEFAULT_SOURCE_PREFERENCE,
  DEFAULT_LESSON_MIN,
} from '../../constants'
import SchoolSearch from '../meal/SchoolSearch'

const GRADES = [1, 2, 3, 4, 5, 6]
const PERIODS = Array.from(
  { length: MAX_PERIODS - MIN_PERIODS + 1 },
  (_, i) => MIN_PERIODS + i
)

const DEFAULT_PERIOD_START_TIMES = [
  '09:00',
  '09:50',
  '10:50',
  '11:40',
  '13:00',
  '13:50',
  '14:40',
]

function buildDefaultPeriodTimes(n) {
  return Array.from({ length: n }, (_, i) => ({
    period: i + 1,
    startTime: DEFAULT_PERIOD_START_TIMES[i] || '15:00',
  }))
}

function syncPeriodTimes(existing, n) {
  const byPeriod = new Map((existing || []).map((e) => [e.period, e.startTime]))
  return Array.from({ length: n }, (_, i) => {
    const p = i + 1
    const start =
      byPeriod.get(p) || DEFAULT_PERIOD_START_TIMES[i] || '15:00'
    return { period: p, startTime: start }
  })
}

function FieldLabel({ children }) {
  return (
    <label className="block text-sm font-bold text-text-muted mb-2">
      {children}
    </label>
  )
}

function inputClass(extra = '') {
  return `w-full px-6 py-4 text-xl rounded-2xl border-2 border-primary/20 bg-white/80 backdrop-blur-sm focus:border-primary focus:outline-none transition-colors ${extra}`
}

export default function TimetableSettings({ onClose }) {
  const { setting, updateSetting } = useClassSetting()
  const [searchMode, setSearchMode] = useState(false)

  const schoolName = setting?.schoolName || ''
  const grade = setting?.grade ?? ''
  const classNo = setting?.classNo ?? ''
  const periodsPerDay = setting?.periodsPerDay || DEFAULT_PERIODS
  const sourcePreference = setting?.sourcePreference || DEFAULT_SOURCE_PREFERENCE
  const periodTimes = setting?.periodTimes || null
  const lessonDurationMin = setting?.lessonDurationMin ?? DEFAULT_LESSON_MIN
  const highlightEnabled = Array.isArray(periodTimes) && periodTimes.length > 0
  const visiblePeriodTimes = highlightEnabled
    ? syncPeriodTimes(periodTimes, periodsPerDay)
    : []

  const togglePeriodTimes = (enable) => {
    if (enable) {
      updateSetting({ periodTimes: buildDefaultPeriodTimes(periodsPerDay) })
    } else {
      updateSetting({ periodTimes: null })
    }
  }

  const handlePeriodStartChange = (period, startTime) => {
    const next = syncPeriodTimes(periodTimes, periodsPerDay).map((entry) =>
      entry.period === period ? { ...entry, startTime } : entry
    )
    updateSetting({ periodTimes: next })
  }

  const handleLessonDurationChange = (value) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    updateSetting({ lessonDurationMin: Math.min(120, Math.max(10, parsed)) })
  }

  const handlePeriodsPerDayChange = (n) => {
    const updates = { periodsPerDay: n }
    if (highlightEnabled) {
      updates.periodTimes = syncPeriodTimes(periodTimes, n)
    }
    updateSetting(updates)
  }

  if (searchMode) {
    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSearchMode(false)}
            className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
            <span className="font-bold">취소</span>
          </button>
        </div>
        <SchoolSearch
          onSelectSchool={(selected) => {
            updateSetting({
              schoolName: selected.schoolName,
              educationOfficeCode: selected.educationOfficeCode,
              schoolCode: selected.schoolCode,
            })
            setSearchMode(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <header className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
          aria-label="닫기"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        <h1 className="text-text-main text-3xl font-black tracking-tight">
          학급 설정
        </h1>
        <div className="w-8" />
      </header>

      <div className="relative w-full max-w-2xl mx-auto">
        <div className="bg-card rounded-[40px] shadow-soft-pink p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <form className="flex flex-col gap-6 relative z-10">
            <div>
              <FieldLabel>학교</FieldLabel>
              <button
                type="button"
                onClick={() => setSearchMode(true)}
                className={inputClass('text-left flex items-center justify-between')}
              >
                <span className={schoolName ? 'text-text-main' : 'text-text-muted'}>
                  {schoolName || '학교 선택'}
                </span>
                <span className="material-symbols-outlined text-text-muted">
                  chevron_right
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>학년</FieldLabel>
                <div className="relative">
                  <select
                    value={grade === '' ? '' : String(grade)}
                    onChange={(e) =>
                      updateSetting({
                        grade: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className={inputClass('appearance-none pr-12 cursor-pointer')}
                  >
                    <option value="">선택</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}학년
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div>
                <FieldLabel>반</FieldLabel>
                <input
                  type="text"
                  inputMode="numeric"
                  value={classNo === '' ? '' : String(classNo)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    updateSetting({ classNo: raw === '' ? null : Number(raw) })
                  }}
                  placeholder="예: 2"
                  className={inputClass()}
                />
              </div>
            </div>

            <div>
              <FieldLabel>하루 교시 수</FieldLabel>
              <div className="relative">
                <select
                  value={String(periodsPerDay)}
                  onChange={(e) =>
                    handlePeriodsPerDayChange(Number(e.target.value))
                  }
                  className={inputClass('appearance-none pr-12 cursor-pointer')}
                >
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}교시
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <FieldLabel>시간표 데이터</FieldLabel>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-primary/20">
                {[
                  { value: 'neis', label: 'NEIS 자동' },
                  { value: 'supabase', label: '직접 입력' },
                ].map((opt) => {
                  const active = sourcePreference === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateSetting({ sourcePreference: opt.value })}
                      className={`py-3 text-lg font-bold rounded-xl transition-colors ${
                        active
                          ? 'bg-primary-light text-primary'
                          : 'text-text-muted hover:text-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              <p className="text-sm text-text-muted mt-2">
                {sourcePreference === 'neis'
                  ? 'NEIS 공공데이터로 자동 불러옵니다.'
                  : '직접 입력한 시간표를 사용합니다.'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel>교시 시간</FieldLabel>
                <button
                  type="button"
                  onClick={() => togglePeriodTimes(!highlightEnabled)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors ${
                    highlightEnabled
                      ? 'bg-primary text-white hover:opacity-90'
                      : 'bg-white/60 text-text-muted hover:bg-primary-light hover:text-primary'
                  }`}
                >
                  {highlightEnabled ? '사용 중' : '사용 안 함'}
                </button>
              </div>
              <p className="text-sm text-text-muted mb-4">
                설정하면 현재 교시가 시간표에 강조 표시됩니다.
              </p>

              {highlightEnabled && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    {visiblePeriodTimes.map((entry) => (
                      <div key={entry.period}>
                        <label className="block text-xs font-bold text-text-muted mb-1.5">
                          {entry.period}교시 시작
                        </label>
                        <input
                          type="time"
                          value={entry.startTime}
                          onChange={(e) =>
                            handlePeriodStartChange(entry.period, e.target.value)
                          }
                          className="w-full px-4 py-3 text-base rounded-xl border-2 border-primary/20 bg-white/80 focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1.5">
                      한 교시 길이 (분)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={120}
                      value={lessonDurationMin}
                      onChange={(e) => handleLessonDurationChange(e.target.value)}
                      className="w-full px-4 py-3 text-base rounded-xl border-2 border-primary/20 bg-white/80 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
