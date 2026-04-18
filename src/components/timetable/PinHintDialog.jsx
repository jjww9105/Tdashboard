export default function PinHintDialog({ hint, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-[40px] shadow-soft-pink p-8 md:p-10 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-text-muted">PIN 힌트</p>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-primary transition-colors"
            aria-label="닫기"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <p className="text-xl font-bold text-text-main leading-relaxed break-keep min-h-16">
          {hint || '힌트가 설정되어 있지 않습니다.'}
        </p>
      </div>
    </div>
  )
}
