import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const JournalContext = createContext()

export const useJournal = () => useContext(JournalContext)

export const JournalProvider = ({ children }) => {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load entries from localStorage
  useEffect(() => {
    if (user) {
      const fetchEntries = () => {
        const storedEntries = localStorage.getItem(`journal_entries_${user.id}`)
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries))
        }
        setLoading(false)
      }

      fetchEntries()
    }
  }, [user])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (user && !loading) {
      localStorage.setItem(`journal_entries_${user.id}`, JSON.stringify(entries))
    }
  }, [entries, user, loading])

  const addEntry = (entry, quote = null) => {
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      quote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setEntries(prev => [newEntry, ...prev])
    return newEntry
  }

  const updateEntry = (id, updatedEntry) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { 
              ...entry, 
              ...updatedEntry, 
              updatedAt: new Date().toISOString() 
            } 
          : entry
      )
    )
  }

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const getEntry = (id) => {
    return entries.find(entry => entry.id === id)
  }

  return (
    <JournalContext.Provider value={{
      entries,
      loading,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntry
    }}>
      {children}
    </JournalContext.Provider>
  )
}
