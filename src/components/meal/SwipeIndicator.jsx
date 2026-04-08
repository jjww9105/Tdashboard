export default function SwipeIndicator({ total, current }) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === current ? 'w-6 bg-primary' : 'w-2 bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}
