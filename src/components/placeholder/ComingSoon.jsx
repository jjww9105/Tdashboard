export default function ComingSoon({ tabName }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <span className="material-symbols-outlined text-7xl text-text-muted">
        construction
      </span>
      <p className="text-2xl font-bold text-text-muted">
        {tabName} 준비 중입니다
      </p>
    </div>
  )
}
