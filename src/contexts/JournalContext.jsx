import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const JournalContext = createContext();

export const useJournal = () => useContext(JournalContext);

export const JournalProvider = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEntry, setActiveEntry] = useState(null);

  // This effect will reliably load entries from localStorage when the user is available
  // and will re-run if the user logs in or out.
  useEffect(() => {
    if (user) {
      try {
        const storedEntries = localStorage.getItem(`journal_entries_${user.id}`);
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        } else {
          setEntries([]); // Ensure entries are cleared if nothing is in storage for the user
        }
      } catch (error) {
        console.error("Failed to parse journal entries from localStorage", error);
        setEntries([]); // Reset to empty array on error
      }
      setLoading(false);
    } else {
      // If there is no user, clear entries and stop loading.
      setEntries([]);
      setLoading(false);
    }
  }, [user]);

  // This effect saves entries to localStorage whenever they change.
  useEffect(() => {
    // We only save if there's a user and the initial loading is complete.
    if (user && !loading) {
      localStorage.setItem(`journal_entries_${user.id}`, JSON.stringify(entries));
    }
  }, [entries, user, loading]);

  const addEntry = (entry, quote = null) => {
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      quote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

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
    );
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntry = (id) => {
    return entries.find(entry => entry.id === id);
  };

  return (
    <JournalContext.Provider value={{
      entries,
      loading,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntry,
      activeEntry,
      setActiveEntry
    }}>
      {children}
    </JournalContext.Provider>
  );
};
