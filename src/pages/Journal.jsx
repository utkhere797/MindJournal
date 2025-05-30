import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJournal } from '../contexts/JournalContext'
import { FiPlus, FiFilter, FiX } from 'react-icons/fi'
import EntryCard from '../components/journal/EntryCard'

const Journal = () => {
  const { entries, deleteEntry } = useJournal()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    mood: '',
    search: '',
  })
  
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }
  
  const clearFilters = () => {
    setFilters({ mood: '', search: '' })
  }
  
  // Filter entries based on current filters
  const filteredEntries = entries.filter(entry => {
    // Filter by mood
    if (filters.mood && entry.mood !== filters.mood) {
      return false
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      return (
        entry.title.toLowerCase().includes(searchTerm) || 
        entry.content.toLowerCase().includes(searchTerm)
      )
    }
    
    return true
  })
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      deleteEntry(id)
    }
  }
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
            Journal
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} total
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={toggleFilters}
            className={`btn btn-outline flex items-center space-x-2 ${
              showFilters || filters.mood || filters.search 
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700' 
                : ''
            }`}
            aria-expanded={showFilters}
          >
            <FiFilter size={18} />
            <span>Filter</span>
            {(filters.mood || filters.search) && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white text-xs">
                {(filters.mood ? 1 : 0) + (filters.search ? 1 : 0)}
              </span>
            )}
          </button>
          
          <Link to="/journal/new" className="btn btn-primary flex items-center space-x-2">
            <FiPlus size={18} />
            <span>New Entry</span>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="card p-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium">Filters</h2>
            <button onClick={clearFilters} className="text-sm text-primary-600 dark:text-primary-400 flex items-center">
              <FiX size={16} className="mr-1" />
              Clear all
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="input"
                placeholder="Search entries..."
              />
            </div>
            
            <div className="sm:w-48">
              <label htmlFor="mood" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Mood
              </label>
              <select
                id="mood"
                name="mood"
                value={filters.mood}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All moods</option>
                <option value="great">Great</option>
                <option value="good">Good</option>
                <option value="okay">Okay</option>
                <option value="bad">Bad</option>
                <option value="awful">Awful</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Entry list */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEntries.map(entry => (
            <EntryCard 
              key={entry.id} 
              entry={entry} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          {entries.length > 0 ? (
            <>
              <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                No entries match your filters
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearFilters}
                className="btn btn-outline"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                Your journal is empty
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Create your first entry to start your journaling journey
              </p>
              <Link to="/journal/new" className="btn btn-primary">
                Create first entry
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Journal