import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/common/ThemeToggle'

const AuthLayout = () => {
  const { user } = useAuth()
  
  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/" replace />
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      
      <footer className="py-4 text-center text-neutral-500 dark:text-neutral-400 text-sm">
        © {new Date().getFullYear()} MindJournal. All rights reserved.
      </footer>
    </div>
  )
}

export default AuthLayout