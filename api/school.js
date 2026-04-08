export default async function handler(req, res) {
  const { query } = req.query

  if (!query || query.length < 2) {
    return res.status(400).json({ error: '검색어는 2글자 이상이어야 합니다.' })
  }

  const apiKey = process.env.NEIS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'NEIS_API_KEY 환경변수가 설정되지 않았습니다.' })
  }

  const url = new URL('https://open.neis.go.kr/hub/schoolInfo')
  url.searchParams.set('KEY', apiKey)
  url.searchParams.set('Type', 'json')
  url.searchParams.set('SCHUL_NM', query)
  url.searchParams.set('SCHUL_KND_SC_NM', '초등학교')
  url.searchParams.set('pSize', '20')

  try {
    const response = await fetch(url.toString())
    const data = await response.json()

    const rows = data?.schoolInfo?.[1]?.row
    if (!rows || rows.length === 0) {
      return res.status(200).json({ schools: [] })
    }

    const schools = rows.map((row) => ({
      schoolName: row.SCHUL_NM,
      educationOfficeCode: row.ATPT_OFCDC_SC_CODE,
      schoolCode: row.SD_SCHUL_CODE,
      address: row.ORG_RDNMA,
    }))

    return res.status(200).json({ schools })
  } catch (error) {
    return res.status(500).json({ error: '학교 정보를 가져오는 중 오류가 발생했습니다.' })
  }
}
