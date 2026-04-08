import { formatDateKorean } from '../../utils/dateUtils'

export default function DateBadge({ date }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-header text-primary font-bold text-lg inline-flex items-center gap-2">
      <span className="material-symbols-outlined filled">calendar_today</span>
      {formatDateKorean(date)}
    </div>
  )
}
