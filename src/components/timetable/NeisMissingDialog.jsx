export default function NeisMissingDialog({ onLater, onManual }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
      onClick={onLater}
    >
      <div
        className="bg-card rounded-[40px] shadow-soft-pink p-8 md:p-10 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-6xl text-primary">
            event_busy
          </span>
          <p className="text-2xl font-bold text-text-main">
            NEIS에 시간표가 없어요
          </p>
          <p className="text-base text-text-muted leading-relaxed break-keep">
            이 학급의 시간표가 NEIS에 등록되어 있지 않습니다.
            <br />
            직접 입력해서 사용할 수 있어요.
          </p>
        </div>

        <div className="flex gap-2 mt-8">
          <button
            type="button"
            onClick={onLater}
            className="flex-1 py-3 rounded-full text-text-muted font-bold bg-white/60 hover:bg-primary-light hover:text-primary transition-colors"
          >
            나중에
          </button>
          <button
            type="button"
            onClick={onManual}
            className="flex-1 py-3 rounded-full bg-primary text-white font-bold hover:opacity-90 transition-opacity"
          >
            지금 입력
          </button>
        </div>
      </div>
    </div>
  )
}
