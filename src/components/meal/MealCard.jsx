import CalorieBadge from './CalorieBadge'

export default function MealCard({ menu, calorie }) {
  if (!menu || menu.length === 0) {
    return (
      <div className="bg-card rounded-[40px] shadow-soft-pink p-10 md:p-16 relative overflow-hidden">
        <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
          <span className="material-symbols-outlined text-6xl text-text-muted">
            no_meals
          </span>
          <p className="text-2xl font-bold text-text-muted">
            오늘은 급식이 없습니다
          </p>
          <p className="text-lg text-text-muted">
            주말이나 공휴일일 수 있어요
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-[40px] shadow-soft-pink p-10 md:p-16 relative overflow-hidden group">
      <CalorieBadge calorie={calorie} />
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="flex flex-col items-center justify-center text-center space-y-6 mt-8 relative z-10">
        {menu.map((item, index) => (
          <p
            key={index}
            className={`text-4xl md:text-5xl font-bold leading-relaxed ${
              index === 0 ? 'text-primary' : 'text-text-main'
            }`}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}
