import { useState, useEffect } from 'react'
import { useClassSetting } from '../../hooks/useClassSetting'
import { useTimetableData } from '../../hooks/useTimetableData'
import { useTeacherAuth } from '../../hooks/useTeacherAuth'
import { useCurrentPeriod } from '../../hooks/useCurrentPeriod'
import { formatWeekRange } from '../../utils/weekUtils'
import { upsertTimetableCell } from '../../utils/supabase'
import { DEFAULT_PERIODS } from '../../constants'
import WeekGrid from './WeekGrid'
import WeekSwiper from './WeekSwiper'
import TimetableSettings from './TimetableSettings'
import PinGate from './PinGate'
import PinSetup from './PinSetup'
import SubjectPicker from './SubjectPicker'
import NeisMissingDialog from './NeisMissingDialog'

function todayWeekday() {
  const day = new Date().getDay()
  if (day === 0 || day === 6) return null
  return day
}

export default function TimetableView() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [stage, setStage] = useState('none')
  const [editMode, setEditMode] = useState(false)
  const [pickerTarget, setPickerTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [neisDialogDismissed, setNeisDialogDismissed] = useState(false)

  const { setting, isConfigured, updateSetting } = useClassSetting()
  const { hasPin } = useTeacherAuth()

  const isInitialSetup = !isConfigured
  const effectiveStage = isInitialSetup ? 'settings' : stage
  const isSupabaseSource = setting?.sourcePreference === 'supabase'

  const { data, isLoading, error, empty, patchCell } = useTimetableData(
    effectiveStage === 'none' && isConfigured ? setting : null,
    weekOffset
  )

  const currentPeriod = useCurrentPeriod(
    setting?.periodTimes || null,
    setting?.lessonDurationMin
  )

  useEffect(() => {
    if (!isSupabaseSource) setEditMode(false)
  }, [isSupabaseSource])

  const shouldShowNeisDialog =
    !neisDialogDismissed &&
    isConfigured &&
    effectiveStage === 'none' &&
    setting?.sourcePreference === 'neis' &&
    weekOffset === 0 &&
    !isLoading &&
    !error &&
    empty

  const handleNeisLater = () => {
    setNeisDialogDismissed(true)
  }

  const handleNeisManual = () => {
    setNeisDialogDismissed(true)
    updateSetting({ sourcePreference: 'supabase' })
    setEditMode(true)
  }

  if (effectiveStage === 'auth') {
    if (hasPin) {
      return (
        <PinGate
          onSuccess={() => setStage('settings')}
          onCancel={() => setStage('none')}
        />
      )
    }
    return (
      <PinSetup
        onSuccess={() => setStage('settings')}
        onCancel={() => setStage('none')}
      />
    )
  }

  if (effectiveStage === 'settings') {
    return (
      <TimetableSettings
        onClose={isInitialSetup ? undefined : () => setStage('none')}
      />
    )
  }

  const weekRange = formatWeekRange(new Date(), weekOffset)
  const periodsPerDay = setting?.periodsPerDay || DEFAULT_PERIODS
  const highlightTodayColumn = weekOffset === 0 ? todayWeekday() : null
  const canEdit = isSupabaseSource && weekOffset === 0
  const currentCell = weekOffset === 0 ? currentPeriod : null

  const titleText =
    weekOffset === 0
      ? '이번 주 시간표'
      : weekOffset < 0
        ? `${-weekOffset}주 전 시간표`
        : `${weekOffset}주 후 시간표`

  const handleCellTap = (weekday, period) => {
    setPickerTarget({ weekday, period })
  }

  const currentSubjectOfTarget = pickerTarget
    ? data.find(
        (r) => r.weekday === pickerTarget.weekday && r.period === pickerTarget.period
      )?.subject || null
    : null

  const handleSelectSubject = async (subject) => {
    if (!pickerTarget || !setting) return
    const { weekday, period } = pickerTarget
    const prev = currentSubjectOfTarget
    patchCell(weekday, period, subject)
    setPickerTarget(null)

    const result = await upsertTimetableCell(
      setting.schoolCode,
      setting.grade,
      setting.classNo,
      weekday,
      period,
      subject
    )
    if (!result.ok) {
      patchCell(weekday, period, prev)
      setToast('저장에 실패했어요. 다시 시도해주세요.')
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 relative">
      <button
        onClick={() => setStage('auth')}
        className="absolute top-4 right-4 md:right-6 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-text-muted hover:text-primary shadow-header transition-colors"
        aria-label="시간표 설정"
      >
        <span className="material-symbols-outlined">settings</span>
      </button>

      <div className="flex flex-col items-center gap-3 w-full">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-header text-primary font-bold text-lg inline-flex items-center gap-2">
          <span className="material-symbols-outlined filled">date_range</span>
          {weekRange}
        </div>
        <h1 className="text-text-main text-5xl font-black leading-tight tracking-tight text-center mt-2">
          {titleText}
        </h1>
      </div>

      {canEdit && (
        <div className="w-full max-w-2xl mx-auto -mb-2">
          <div className="flex items-center justify-between px-5 py-3 rounded-full bg-primary-light text-primary">
            <span className="flex items-center gap-2 text-base font-bold">
              <span className="material-symbols-outlined text-lg">
                {editMode ? 'edit' : 'lock'}
              </span>
              {editMode ? '편집 중' : '읽기 전용'}
            </span>
            <button
              type="button"
              onClick={() => setEditMode((v) => !v)}
              className="text-sm font-bold hover:underline underline-offset-4"
            >
              {editMode ? '완료' : '편집'}
            </button>
          </div>
        </div>
      )}

      <WeekSwiper weekOffset={weekOffset} onChangeOffset={setWeekOffset}>
        <WeekGrid
          data={data}
          periodsPerDay={periodsPerDay}
          todayWeekday={highlightTodayColumn}
          currentCell={currentCell}
          isLoading={isLoading}
          error={error}
          empty={empty}
          editMode={canEdit && editMode}
          onCellTap={handleCellTap}
        />
      </WeekSwiper>

      {pickerTarget && (
        <SubjectPicker
          target={pickerTarget}
          currentSubject={currentSubjectOfTarget}
          onSelect={handleSelectSubject}
          onClose={() => setPickerTarget(null)}
        />
      )}

      {shouldShowNeisDialog && (
        <NeisMissingDialog onLater={handleNeisLater} onManual={handleNeisManual} />
      )}

      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-card shadow-soft-pink text-sm text-text-muted">
          {toast}
        </div>
      )}
    </div>
  )
}
