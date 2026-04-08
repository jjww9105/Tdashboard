import DateBadge from './DateBadge'

export default function PageTitle({ title, date }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <DateBadge date={date} />
      <h1 className="text-text-main text-5xl font-black leading-tight tracking-tight text-center mt-2">
        {title}
      </h1>
    </div>
  )
}
