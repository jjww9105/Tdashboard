import { createClient } from '@supabase/supabase-js'
import {
  DEFAULT_PERIODS,
  DEFAULT_LESSON_MIN,
  DEFAULT_SOURCE_PREFERENCE,
} from '../constants'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// ----- class_setting: 학급 전역 설정 -----

export async function saveClassSetting(setting) {
  if (!supabase) return

  const { error } = await supabase
    .from('class_setting')
    .upsert(
      {
        id: 'default',
        school_name: setting.schoolName,
        education_office_code: setting.educationOfficeCode,
        school_code: setting.schoolCode,
        grade: setting.grade ?? null,
        class_no: setting.classNo ?? null,
        source_preference: setting.sourcePreference ?? DEFAULT_SOURCE_PREFERENCE,
        periods_per_day: setting.periodsPerDay ?? DEFAULT_PERIODS,
        period_times: setting.periodTimes ?? null,
        lesson_duration_min: setting.lessonDurationMin ?? DEFAULT_LESSON_MIN,
      },
      { onConflict: 'id' }
    )

  if (error) console.warn('class_setting 저장 실패:', error.message)
}

export async function loadClassSetting() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('class_setting')
    .select('*')
    .eq('id', 'default')
    .single()

  if (error || !data) return null

  return {
    schoolName: data.school_name,
    educationOfficeCode: data.education_office_code,
    schoolCode: data.school_code,
    grade: data.grade ?? null,
    classNo: data.class_no ?? null,
    sourcePreference: data.source_preference ?? DEFAULT_SOURCE_PREFERENCE,
    periodsPerDay: data.periods_per_day ?? DEFAULT_PERIODS,
    periodTimes: data.period_times ?? null,
    lessonDurationMin: data.lesson_duration_min ?? DEFAULT_LESSON_MIN,
  }
}

// ----- 급식 탭 호환: 기존 saveSchoolSetting/loadSchoolSetting 를 class_setting 테이블로 리다이렉트 -----

export async function saveSchoolSetting(school) {
  const existing = (await loadClassSetting()) || {}
  return saveClassSetting({
    ...existing,
    schoolName: school.schoolName,
    educationOfficeCode: school.educationOfficeCode,
    schoolCode: school.schoolCode,
  })
}

export async function loadSchoolSetting() {
  const setting = await loadClassSetting()
  if (!setting) return null
  return {
    schoolName: setting.schoolName,
    educationOfficeCode: setting.educationOfficeCode,
    schoolCode: setting.schoolCode,
  }
}

// ----- timetable: 주간 시간표 (NEIS 미등록 학교 fallback) -----

export async function loadTimetableWeek(schoolCode, grade, classNo) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('timetable')
    .select('*')
    .eq('school_code', schoolCode)
    .eq('grade', grade)
    .eq('class_no', classNo)

  if (error || !data) return []

  return data.map((row) => ({
    weekday: row.weekday,
    period: row.period,
    subject: row.subject,
  }))
}

export async function upsertTimetableCell(
  schoolCode,
  grade,
  classNo,
  weekday,
  period,
  subject
) {
  if (!supabase) return { ok: false }

  const { error } = await supabase
    .from('timetable')
    .upsert(
      {
        school_code: schoolCode,
        grade,
        class_no: classNo,
        weekday,
        period,
        subject,
      },
      { onConflict: 'school_code,grade,class_no,weekday,period' }
    )

  if (error) {
    console.warn('timetable 저장 실패:', error.message)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
