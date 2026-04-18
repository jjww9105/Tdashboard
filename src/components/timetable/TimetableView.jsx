import { useState, useEffect } from 'react'
import { useClassSetting } from '../../hooks/useClassSetting'
import { useTimetableData } from '../../hooks/useTimetableData'
import { useTeacherAuth } from '../../hooks/useTeacherAuth'
import { useCurrentPeriod } from '../../hooks/useCurrentPeriod'
import { upsertTimetableCell } from '../../utils/supabase'
import { DEFAULT_PERIODS } from '../../constants'
import PageTitle from '../common/PageTitle'
import WeekGrid from './WeekGrid'
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
    0
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

  const periodsPerDay = setting?.periodsPerDay || DEFAULT_PERIODS
  const highlightTodayColumn = todayWeekday()
  const canEdit = isSupabaseSource
  const currentCell = currentPeriod

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
      <div className="absolute top-4 right-4 md:right-6 z-20 flex items-center gap-2">
        {canEdit && (
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className={`w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-sm shadow-header transition-colors ${
              editMode
                ? 'bg-primary text-white hover:opacity-90'
                : 'bg-white/80 text-text-muted hover:text-primary'
            }`}
            aria-label={editMode ? '편집 완료' : '시간표 편집'}
            aria-pressed={editMode}
          >
            <span className="material-symbols-outlined">
              {editMode ? 'done' : 'edit'}
            </span>
          </button>
        )}
        <button
          onClick={() => setStage('auth')}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-text-muted hover:text-primary shadow-header transition-colors"
          aria-label="시간표 설정"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <PageTitle title="우리 반 시간표" date={new Date()} />

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
