const DAY_LABELS = ['월', '화', '수', '목', '금']

export default function WeekdayHeader({ todayWeekday }) {
  return (
    <div className="grid grid-cols-5 gap-2 mb-3">
      {DAY_LABELS.map((label, idx) => {
        const weekday = idx + 1
        const isToday = weekday === todayWeekday
        return (
          <div
            key={weekday}
            className={`flex items-center justify-center py-2 rounded-full text-base font-bold ${
              isToday
                ? 'bg-primary-light text-primary'
                : 'text-text-muted'
            }`}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}
