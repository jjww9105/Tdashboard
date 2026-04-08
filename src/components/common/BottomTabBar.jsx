const tabs = [
  { id: 'meal', label: '급식', icon: 'restaurant' },
  { id: 'schedule', label: '시간표', icon: 'schedule' },
  { id: 'notice', label: '알림장', icon: 'campaign' },
  { id: 'more', label: '더보기', icon: 'more_horiz' },
]

export default function BottomTabBar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 w-full h-[100px] bg-card rounded-t-[40px] shadow-tabbar flex justify-around items-center px-6 z-50">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 group transition-colors ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-primary'
            }`}
          >
            <div
              className={`p-3 rounded-full transition-transform duration-300 group-hover:-translate-y-2 ${
                isActive ? 'bg-primary-light' : 'group-hover:bg-primary-light'
              }`}
            >
              <span
                className={`material-symbols-outlined text-3xl ${isActive ? 'filled' : ''}`}
              >
                {tab.icon}
              </span>
            </div>
            <span className="text-sm font-bold">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
