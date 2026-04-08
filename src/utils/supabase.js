import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function saveSchoolSetting(school) {
  if (!supabase) return

  const { error } = await supabase
    .from('school_settings')
    .upsert(
      {
        id: 'default',
        school_name: school.schoolName,
        education_office_code: school.educationOfficeCode,
        school_code: school.schoolCode,
      },
      { onConflict: 'id' }
    )

  if (error) console.warn('Supabase 저장 실패:', error.message)
}

export async function loadSchoolSetting() {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('school_settings')
    .select('*')
    .eq('id', 'default')
    .single()

  if (error || !data) return null

  return {
    schoolName: data.school_name,
    educationOfficeCode: data.education_office_code,
    schoolCode: data.school_code,
  }
}
