export default async function handler(req, res) {
  const { educationOfficeCode, schoolCode, date } = req.query

  if (!educationOfficeCode || !schoolCode || !date) {
    return res.status(400).json({ error: 'educationOfficeCode, schoolCode, date 파라미터가 필요합니다.' })
  }

  const apiKey = process.env.NEIS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'NEIS_API_KEY 환경변수가 설정되지 않았습니다.' })
  }

  const url = new URL('https://open.neis.go.kr/hub/mealServiceDietInfo')
  url.searchParams.set('KEY', apiKey)
  url.searchParams.set('Type', 'json')
  url.searchParams.set('ATPT_OFCDC_SC_CODE', educationOfficeCode)
  url.searchParams.set('SD_SCHUL_CODE', schoolCode)
  url.searchParams.set('MLSV_YMD', date)

  try {
    const response = await fetch(url.toString())
    const data = await response.json()

    const mealInfo = data?.mealServiceDietInfo?.[1]?.row
    if (!mealInfo || mealInfo.length === 0) {
      return res.status(200).json({ menu: [], calorie: null })
    }

    const meal = mealInfo[0]
    const menu = meal.DDISH_NM
      .split('<br/>')
      .map((item) => item.replace(/\([0-9.]+\)/g, '').trim())
      .filter(Boolean)

    const calorieMatch = meal.CAL_INFO?.match(/[\d.]+/)
    const calorie = calorieMatch ? Math.round(parseFloat(calorieMatch[0])) : null

    return res.status(200).json({ menu, calorie })
  } catch (error) {
    return res.status(500).json({ error: '급식 데이터를 가져오는 중 오류가 발생했습니다.' })
  }
}
