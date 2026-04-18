import { useState, useEffect } from 'react'
import PinKeypad from './PinKeypad'
import { useTeacherAuth } from '../../hooks/useTeacherAuth'

export default function PinSetup({ onSuccess, onCancel }) {
  const { createPin } = useTeacherAuth()
  const [step, setStep] = useState('first')
  const [firstPin, setFirstPin] = useState('')
  const [secondPin, setSecondPin] = useState('')
  const [hint, setHint] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (step === 'first' && firstPin.length === 4) {
      setStep('confirm')
    }
  }, [step, firstPin])

  useEffect(() => {
    if (step !== 'confirm' || secondPin.length !== 4) return
    if (secondPin === firstPin) {
      setStep('hint')
    } else {
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setSecondPin('')
        setFirstPin('')
        setStep('first')
      }, 320)
    }
  }, [step, secondPin, firstPin])

  const handleSave = () => {
    createPin(firstPin, hint)
    onSuccess()
  }

  return (
    <div className="flex flex-col gap-6 p-4 min-h-[60vh]">
      <header className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
          aria-label="닫기"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
        <h1 className="text-text-main text-3xl font-black tracking-tight">
          선생님 PIN 만들기
        </h1>
        <div className="w-8" />
      </header>

      {step === 'first' && (
        <div className="flex flex-col items-center gap-6 mt-4">
          <p className="text-base text-text-muted">
            설정 변경을 막을 4자리 숫자를 정해주세요
          </p>
          <PinKeypad value={firstPin} onChange={setFirstPin} />
        </div>
      )}

      {step === 'confirm' && (
        <div className="flex flex-col items-center gap-6 mt-4">
          <p className="text-base text-text-muted">한 번 더 입력해주세요</p>
          <PinKeypad value={secondPin} onChange={setSecondPin} shaking={shake} />
        </div>
      )}

      {step === 'hint' && (
        <div className="flex flex-col items-center gap-6 mt-4 px-4">
          <p className="text-base text-text-muted text-center leading-relaxed break-keep">
            PIN을 잊었을 때 볼 힌트를 적어주세요.
            <br />
            <span className="text-sm">
              학생이 추측할 수 없는 개인적인 연상으로 적어주세요.
              <br />
              (예: 첫 반려견 태어난 해 앞 두 자리)
            </span>
          </p>
          <div className="w-full max-w-lg">
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="힌트 입력 (비워두면 나중에 확인 불가)"
              maxLength={40}
              className="w-full px-6 py-4 text-xl rounded-2xl border-2 border-primary/20 bg-white/80 backdrop-blur-sm focus:border-primary focus:outline-none transition-colors"
              autoFocus
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="mt-2 flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">check</span>
            완료
          </button>
        </div>
      )}
    </div>
  )
}
