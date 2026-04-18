import WeekdayHeader from './WeekdayHeader'
import TimetableCell from './TimetableCell'

function buildCellMap(data) {
  const map = new Map()
  for (const row of data) {
    map.set(`${row.weekday}-${row.period}`, row.subject)
  }
  return map
}

export default function WeekGrid({
  data,
  periodsPerDay,
  todayWeekday,
  currentCell,
  isLoading,
  error,
  empty,
  editMode,
  onCellTap,
}) {
  const cellMap = buildCellMap(data || [])
  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1)
  const showGrid = !isLoading && !error && (!empty || editMode)

  return (
    <div className="bg-card rounded-[40px] shadow-soft-pink p-6 md:p-10 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <WeekdayHeader todayWeekday={todayWeekday} />

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-lg font-bold text-text-muted animate-pulse">
              시간표를 불러오는 중...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-outlined text-6xl text-text-muted">
              cloud_off
            </span>
            <p className="text-lg font-bold text-text-muted">
              시간표를 불러올 수 없습니다
            </p>
            <p className="text-sm text-text-muted">{error}</p>
          </div>
        )}

        {!isLoading && !error && empty && !editMode && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-outlined text-6xl text-text-muted">
              event_busy
            </span>
            <p className="text-lg font-bold text-text-muted">
              시간표가 없습니다
            </p>
          </div>
        )}

        {showGrid && (
          <div className="flex flex-col gap-2">
            {periods.map((period) => (
              <div key={period} className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((weekday) => (
                  <TimetableCell
                    key={`${weekday}-${period}`}
                    subject={cellMap.get(`${weekday}-${period}`)}
                    isToday={weekday === todayWeekday}
                    isCurrent={
                      currentCell?.weekday === weekday &&
                      currentCell?.period === period
                    }
                    editMode={editMode}
                    onClick={editMode ? () => onCellTap(weekday, period) : undefined}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
