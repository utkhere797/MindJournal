import { Outlet } from 'react-router-dom'
import { JournalProvider } from '../contexts/JournalContext'
import Sidebar from '../components/navigation/Sidebar'
import MobileHeader from '../components/navigation/MobileHeader'

const MainLayout = () => {
  return (
    <JournalProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50 dark:bg-neutral-900">
        {/* Mobile Header - visible on small screens */}
        <MobileHeader />
        
        {/* Sidebar - hidden on mobile, visible on md screens and up */}
        <div className="hidden md:block md:w-64 lg:w-72">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
          <div className="pt-16 md:pt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </JournalProvider>
  )
}

export default MainLayout