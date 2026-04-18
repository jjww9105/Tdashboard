import { useState, useEffect } from 'react'
import { SUBJECT_LIST, SUBJECT_OTHER } from '../../utils/subjectList'

const WEEKDAY_LABELS = ['', '월', '화', '수', '목', '금']

export default function SubjectPicker({
  target,
  currentSubject,
  onSelect,
  onClose,
}) {
  const [mode, setMode] = useState('list')
  const [customValue, setCustomValue] = useState('')

  useEffect(() => {
    setMode('list')
    setCustomValue(
      currentSubject && !SUBJECT_LIST.includes(currentSubject) ? currentSubject : ''
    )
  }, [target, currentSubject])

  const submitCustom = () => {
    const v = customValue.trim()
    if (!v) return
    onSelect(v)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-card rounded-t-[40px] shadow-tabbar px-6 pt-4 pb-10 max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 rounded-full bg-text-muted/30 mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-main">
            {target
              ? `${WEEKDAY_LABELS[target.weekday]}요일 ${target.period}교시`
              : '과목 선택'}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-primary transition-colors"
            aria-label="닫기"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {mode === 'list' && (
          <div className="grid grid-cols-3 gap-2">
            {SUBJECT_LIST.map((s) => {
              const active = currentSubject === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSelect(s)}
                  className={`px-4 py-3 rounded-2xl text-base font-bold transition-colors break-keep ${
                    active
                      ? 'bg-primary text-white'
                      : 'bg-white/60 text-text-main hover:bg-primary-light hover:text-primary'
                  }`}
                >
                  {s}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setMode('custom')}
              className="px-4 py-3 rounded-2xl text-base font-bold text-text-muted bg-white/60 hover:bg-primary-light hover:text-primary transition-colors"
            >
              {SUBJECT_OTHER}
            </button>
          </div>
        )}

        {mode === 'custom' && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitCustom()
              }}
              placeholder="과목명 입력"
              maxLength={20}
              autoFocus
              className="w-full px-6 py-4 text-xl rounded-2xl border-2 border-primary/20 bg-white/80 backdrop-blur-sm focus:border-primary focus:outline-none transition-colors"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setMode('list')}
                className="px-5 py-2 rounded-full text-text-muted font-bold hover:text-primary transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submitCustom}
                disabled={!customValue.trim()}
                className="px-5 py-2 rounded-full bg-primary text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
