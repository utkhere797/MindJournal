import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // In a real app, this would be an API call to authenticate
    return new Promise((resolve, reject) => {
      // Find user in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        // Create a user object without the password
        const { password, ...userWithoutPassword } = foundUser
        
        // Save to state and localStorage
        setUser(userWithoutPassword)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))
        resolve(userWithoutPassword)
      } else {
        reject(new Error('Invalid email or password'))
      }
    })
  }

  const register = (name, email, password) => {
    // In a real app, this would be an API call to register
    return new Promise((resolve, reject) => {
      // Get existing users or create empty array
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        reject(new Error('User with this email already exists'))
        return
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      }
      
      // Save user to localStorage
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      
      // Login the new user
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      
      resolve(userWithoutPassword)
    })
  }

  const logout = () => {
    // Remove user from state and localStorage
    setUser(null)
    localStorage.removeItem('user')
    navigate('/login')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}