import { useState, useEffect } from 'react'
import PinKeypad from './PinKeypad'
import PinHintDialog from './PinHintDialog'
import { useTeacherAuth } from '../../hooks/useTeacherAuth'

export default function PinGate({ onSuccess, onCancel }) {
  const { verifyPin, getHint } = useTeacherAuth()
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (value.length !== 4) return
    if (verifyPin(value)) {
      onSuccess()
    } else {
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setValue('')
      }, 320)
    }
  }, [value, verifyPin, onSuccess])

  return (
    <div className="flex flex-col gap-8 p-4 min-h-[60vh]">
      <header className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
          aria-label="닫기"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        <h1 className="text-text-main text-3xl font-black tracking-tight">
          선생님 잠금
        </h1>
        <div className="w-8" />
      </header>

      <div className="flex flex-col items-center gap-6 mt-8">
        <p className="text-base text-text-muted">PIN 4자리를 입력하세요</p>
        <PinKeypad value={value} onChange={setValue} shaking={shake} />
        <button
          type="button"
          onClick={() => setShowHint(true)}
          className="mt-2 text-sm text-primary underline-offset-4 hover:underline"
        >
          힌트 보기
        </button>
      </div>

      {showHint && (
        <PinHintDialog hint={getHint()} onClose={() => setShowHint(false)} />
      )}
    </div>
  )
}
