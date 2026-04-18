export default function TimetableCell({
  subject,
  isToday,
  isCurrent,
  editMode,
  onClick,
}) {
  const base =
    'rounded-2xl flex items-center justify-center text-center p-2 aspect-[3/4] md:aspect-square transition-colors w-full'
  const interactive = editMode
    ? 'cursor-pointer hover:ring-2 hover:ring-primary/40 active:scale-95'
    : ''
  const currentRing = isCurrent ? 'ring-4 ring-primary' : ''

  const content = !subject ? (
    <span className={`text-sm ${editMode ? 'text-primary/60' : 'text-text-muted'}`}>
      {editMode ? '+' : '—'}
    </span>
  ) : (
    <span
      className={`text-base md:text-lg font-bold leading-tight break-keep line-clamp-2 ${
        isToday ? 'text-primary' : 'text-text-main'
      }`}
    >
      {subject}
    </span>
  )

  const bg = !subject
    ? 'bg-white/50'
    : isToday
      ? 'bg-primary-light'
      : 'bg-white/70'

  if (editMode) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${bg} ${interactive} ${currentRing}`}
      >
        {content}
      </button>
    )
  }

  return <div className={`${base} ${bg} ${currentRing}`}>{content}</div>
}
