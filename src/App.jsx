import { useState, useCallback, useEffect } from 'react'
import AppHeader from './components/common/AppHeader'
import BottomTabBar from './components/common/BottomTabBar'
import MealSwiper from './components/meal/MealSwiper'
import SchoolSearch from './components/meal/SchoolSearch'
import ComingSoon from './components/placeholder/ComingSoon'
import TimetableView from './components/timetable/TimetableView'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useWakeLock } from './hooks/useWakeLock'
import { STORAGE_KEY_SCHOOL } from './constants'
import { saveSchoolSetting, loadSchoolSetting } from './utils/supabase'

function App() {
  const [activeTab, setActiveTab] = useState('meal')
  const [school, setSchool, removeSchool] = useLocalStorage(STORAGE_KEY_SCHOOL, null)
  const [showSchoolSearch, setShowSchoolSearch] = useState(false)

  useWakeLock()

  // Supabase에서 학교 설정 로드 (localStorage 비어있을 때)
  useEffect(() => {
    if (!school) {
      loadSchoolSetting().then((saved) => {
        if (saved) setSchool(saved)
      })
    }
  }, [])

  const handleSelectSchool = useCallback((selected) => {
    const schoolData = {
      schoolName: selected.schoolName,
      educationOfficeCode: selected.educationOfficeCode,
      schoolCode: selected.schoolCode,
    }
    setSchool(schoolData)
    saveSchoolSetting(schoolData)
    setShowSchoolSearch(false)
  }, [setSchool])

  const handleSchoolChange = useCallback(() => {
    setShowSchoolSearch(true)
  }, [])

  const needsSchoolSetup = !school && activeTab === 'meal'
  const showSearch = needsSchoolSetup || showSchoolSearch

  const tabContent = {
    meal: showSearch
      ? <SchoolSearch onSelectSchool={handleSelectSchool} />
      : <MealSwiper school={school} />,
    schedule: <TimetableView />,
    notice: <ComingSoon tabName="알림장" />,
    more: <ComingSoon tabName="더보기" />,
  }

  return (
    <div className="flex flex-col min-h-screen min-h-dvh">
      <div className="flex-1 flex justify-center py-5 px-4">
        <div className="flex flex-col w-full max-w-[960px]">
          <AppHeader onSchoolChange={handleSchoolChange} />
          <main className="flex-1 pb-[120px]">
            {tabContent[activeTab]}
          </main>
        </div>
      </div>
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
