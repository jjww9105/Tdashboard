export default function SchoolSearchItem({ school, onSelect }) {
  return (
    <button
      onClick={() => onSelect(school)}
      className="w-full text-left px-6 py-4 hover:bg-primary-light transition-colors rounded-2xl group"
    >
      <p className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">
        {school.schoolName}
      </p>
      <p className="text-sm text-text-muted mt-1">{school.address}</p>
    </button>
  )
}
