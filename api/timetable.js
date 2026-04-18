export default async function handler(req, res) {
  const { educationOfficeCode, schoolCode, grade, classNo, fromDate, toDate } = req.query

  if (!educationOfficeCode || !schoolCode || !grade || !classNo || !fromDate || !toDate) {
    return res.status(400).json({
      error: 'educationOfficeCode, schoolCode, grade, classNo, fromDate, toDate 파라미터가 필요합니다.',
    })
  }

  const apiKey = process.env.NEIS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'NEIS_API_KEY 환경변수가 설정되지 않았습니다.' })
  }

  const y = Number(fromDate.slice(0, 4))
  const m = Number(fromDate.slice(4, 6))
  const academicYear = m >= 3 ? y : y - 1
  const semester = m >= 3 && m <= 8 ? 1 : 2

  const url = new URL('https://open.neis.go.kr/hub/elsTimetable')
  url.searchParams.set('KEY', apiKey)
  url.searchParams.set('Type', 'json')
  url.searchParams.set('ATPT_OFCDC_SC_CODE', educationOfficeCode)
  url.searchParams.set('SD_SCHUL_CODE', schoolCode)
  url.searchParams.set('AY', String(academicYear))
  url.searchParams.set('SEM', String(semester))
  url.searchParams.set('GRADE', String(grade))
  url.searchParams.set('CLASS_NM', String(classNo))
  url.searchParams.set('TI_FROM_YMD', fromDate)
  url.searchParams.set('TI_TO_YMD', toDate)
  url.searchParams.set('pSize', '100')

  try {
    const response = await fetch(url.toString())
    const data = await response.json()

    if (data?.RESULT?.CODE === 'INFO-200') {
      return res.status(200).json({ source: 'neis', data: [], empty: true })
    }

    if (data?.RESULT?.CODE && data.RESULT.CODE !== 'INFO-000') {
      return res.status(200).json({
        source: 'neis',
        data: [],
        empty: false,
        error: data.RESULT.MESSAGE || 'NEIS 오류',
      })
    }

    const rows = data?.elsTimetable?.[1]?.row
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(200).json({ source: 'neis', data: [], empty: true })
    }

    const parsed = []
    for (const row of rows) {
      const ymd = row.ALL_TI_YMD
      if (!ymd || ymd.length !== 8) continue
      const yy = Number(ymd.slice(0, 4))
      const mm = Number(ymd.slice(4, 6)) - 1
      const dd = Number(ymd.slice(6, 8))
      const day = new Date(yy, mm, dd).getDay()
      if (day === 0 || day === 6) continue
      const period = Number(row.PERIO)
      if (!Number.isFinite(period) || period < 1) continue
      const subject = (row.ITRT_CNTNT || '').trim()
      if (!subject) continue
      parsed.push({ weekday: day, period, subject })
    }

    return res.status(200).json({ source: 'neis', data: parsed, empty: false })
  } catch (error) {
    return res.status(200).json({
      source: 'neis',
      data: [],
      empty: false,
      error: '시간표 데이터를 가져오는 중 오류가 발생했습니다.',
    })
  }
}
