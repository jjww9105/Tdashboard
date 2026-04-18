const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

export default function PinKeypad({ value, onChange, shaking = false, maxLength = 4 }) {
  const handlePress = (digit) => {
    if (value.length >= maxLength) return
    onChange(value + digit)
  }

  const handleBackspace = () => {
    onChange(value.slice(0, -1))
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className={`flex gap-4 ${shaking ? 'animate-shake' : ''}`}
        aria-label="PIN 입력 상태"
      >
        {Array.from({ length: maxLength }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-colors ${
              i < value.length ? 'bg-primary' : 'bg-primary/20'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => handlePress(k)}
            className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm text-3xl font-bold text-text-main hover:bg-primary-light hover:text-primary active:scale-95 transition-all"
          >
            {k}
          </button>
        ))}
        <div className="w-20 h-20" aria-hidden="true" />
        <button
          type="button"
          onClick={() => handlePress('0')}
          className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm text-3xl font-bold text-text-main hover:bg-primary-light hover:text-primary active:scale-95 transition-all"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="w-20 h-20 rounded-full flex items-center justify-center text-text-muted hover:text-primary active:scale-95 transition-all"
          aria-label="삭제"
        >
          <span className="material-symbols-outlined text-2xl">backspace</span>
        </button>
      </div>
    </div>
  )
}
