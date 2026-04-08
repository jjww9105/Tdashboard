import { useSchoolSearch } from '../../hooks/useSchoolSearch'
import SchoolSearchItem from './SchoolSearchItem'

export default function SchoolSearch({ onSelectSchool }) {
  const { query, setQuery, results, isLoading } = useSchoolSearch()

  return (
    <div className="flex flex-col items-center gap-6 mt-12 px-4">
      <span className="material-symbols-outlined text-7xl text-primary">search</span>
      <h1 className="text-text-main text-4xl font-black text-center">
        학교를 검색하세요
      </h1>
      <p className="text-text-muted text-lg text-center">
        급식 정보를 불러올 학교를 선택해주세요
      </p>

      <div className="w-full max-w-lg mt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="학교 이름 입력..."
          className="w-full px-6 py-4 text-xl rounded-2xl border-2 border-primary/20 bg-white/80 backdrop-blur-sm focus:border-primary focus:outline-none transition-colors"
          autoFocus
        />
      </div>

      <div className="w-full max-w-lg">
        {isLoading && (
          <p className="text-center text-text-muted py-4">검색 중...</p>
        )}

        {!isLoading && query.length >= 2 && results.length === 0 && (
          <p className="text-center text-text-muted py-4">검색 결과가 없습니다</p>
        )}

        {results.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft-pink overflow-hidden divide-y divide-primary/10">
            {results.map((school) => (
              <SchoolSearchItem
                key={`${school.educationOfficeCode}_${school.schoolCode}`}
                school={school}
                onSelect={onSelectSchool}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
