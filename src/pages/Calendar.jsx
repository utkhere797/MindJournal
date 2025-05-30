import { useState, useMemo, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJournal } from '../contexts/JournalContext'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isToday, isSameMonth, isEqual, parseISO, addMonths, subMonths } from 'date-fns'
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi'
import MoodIcon from '../components/journal/MoodIcon'

const Calendar = () => {
  const { entries } = useJournal()
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }
  
  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    
    const rows = []
    let days = []
    let day = startDate
    
    // Map entries to dates
    const entriesByDate = entries.reduce((acc, entry) => {
      const date = parseISO(entry.createdAt)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      
      acc[dateStr].push(entry)
      return acc
    }, {})
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateStr = format(day, 'yyyy-MM-dd')
        const dayEntries = entriesByDate[dateStr] || []
        
        days.push({
          date: day,
          isCurrentMonth: isSameMonth(day, monthStart),
          isToday: isToday(day),
          entries: dayEntries
        })
        
        day = addDays(day, 1)
      }
      
      rows.push(days)
      days = []
    }
    
    return rows
  }, [currentMonth, entries])
  
  const handleDayClick = (day) => {
    if (day.entries.length > 0) {
      navigate(`/journal/${day.entries[0].id}`)
    } else if (day.isToday) {
      navigate('/journal/new')
    }
  }
  
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
          Calendar
        </h1>
        
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Previous month"
          >
            <FiChevronLeft size={20} />
          </button>
          
          <button
            className="px-4 py-2 font-medium"
            onClick={() => setCurrentMonth(new Date())}
          >
            {format(currentMonth, 'MMMM yyyy')}
          </button>
          
          <button
            onClick={nextMonth}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Next month"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 text-center bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 font-medium text-neutral-600 dark:text-neutral-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
          {calendarDays.map((week, weekIndex) => (
            <Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div 
                  key={dayIndex}
                  className={`min-h-[100px] p-2 border-r border-neutral-200 dark:border-neutral-700 last:border-r-0 
                    ${!day.isCurrentMonth ? 'bg-neutral-50 dark:bg-neutral-850' : ''}
                    ${day.isToday ? 'bg-primary-50 dark:bg-primary-900/10' : ''}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                        ${day.isToday ? 'bg-primary-500 text-white' : 
                          day.isCurrentMonth ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-600'}
                      `}
                    >
                      {format(day.date, 'd')}
                    </div>
                    
                    {day.isCurrentMonth && day.isToday && !day.entries.length && (
                      <button
                        onClick={() => navigate('/journal/new')}
                        className="p-1 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        aria-label="Create entry for today"
                      >
                        <FiPlus size={14} />
                      </button>
                    )}
                  </div>
                  
                  {day.entries.length > 0 && (
                    <div 
                      className="mt-2 p-1.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
                      onClick={() => handleDayClick(day)}
                    >
                      <div className="flex items-center space-x-1 text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        <MoodIcon mood={day.entries[0].mood} size={14} />
                        <span className="truncate">{day.entries[0].title}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar