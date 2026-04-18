import { getWeekdayFromYMD } from './weekUtils'

export function parseNeisRows(rows) {
  if (!Array.isArray(rows)) return []

  const result = []
  for (const row of rows) {
    const weekday = getWeekdayFromYMD(row.ALL_TI_YMD)
    if (weekday == null) continue
    const period = Number(row.PERIO)
    if (!Number.isFinite(period) || period < 1) continue
    const subject = (row.ITRT_CNTNT || '').trim()
    if (!subject) continue
    result.push({ weekday, period, subject })
  }
  return result
}
