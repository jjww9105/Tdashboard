export function getMondayOfWeek(date, offset = 0) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff + offset * 7)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getFridayOfWeek(date, offset = 0) {
  const monday = getMondayOfWeek(date, offset)
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  return friday
}

export function formatYYYYMMDD(date) {
  const d = date instanceof Date ? date : new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

export function getSemester(date) {
  const d = date instanceof Date ? date : new Date(date)
  const month = d.getMonth() + 1
  return month >= 3 && month <= 8 ? 1 : 2
}

export function getAcademicYear(date) {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  return month >= 3 ? year : year - 1
}

export function getWeekdayFromYMD(ymd) {
  const y = Number(ymd.slice(0, 4))
  const m = Number(ymd.slice(4, 6)) - 1
  const d = Number(ymd.slice(6, 8))
  const day = new Date(y, m, d).getDay()
  if (day === 0 || day === 6) return null
  return day
}

export function formatWeekRange(date, offset = 0) {
  const mon = getMondayOfWeek(date, offset)
  const fri = getFridayOfWeek(date, offset)
  const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`
  return `${fmt(mon)} ~ ${fmt(fri)}`
}
