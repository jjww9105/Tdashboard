export default function CalorieBadge({ calorie }) {
  if (!calorie) return null

  return (
    <div className="absolute top-6 right-6 bg-gradient-to-r from-gradient-cal-start to-gradient-cal-end px-5 py-2 rounded-full text-white font-bold text-lg shadow-md flex items-center gap-1 z-10">
      <span className="material-symbols-outlined text-sm filled">
        local_fire_department
      </span>
      {calorie} kcal
    </div>
  )
}
