import { useState, useEffect } from 'react'
import { FiCheck, FiSmile, FiMeh, FiFrown } from 'react-icons/fi'

const moods = [
  { id: 'great', label: 'Great', icon: <FiSmile className="text-green-500" size={24} />, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' },
  { id: 'good', label: 'Good', icon: <FiSmile className="text-blue-500\" size={24} />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' },
  { id: 'okay', label: 'Okay', icon: <FiMeh className="text-yellow-500" size={24} />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' },
  { id: 'bad', label: 'Bad', icon: <FiMeh className="text-orange-500\" size={24} />, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' },
  { id: 'awful', label: 'Awful', icon: <FiFrown className="text-red-500" size={24} />, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' }
]

const EntryForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    activities: [],
    ...initialData
  })
  
  const [customActivity, setCustomActivity] = useState('')
  
  const commonActivities = [
    'Exercise', 'Reading', 'Meditation', 'Work', 'Family time', 
    'Friends', 'Hobbies', 'Self-care', 'Relaxation', 'Nature'
  ]
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleMoodSelect = (mood) => {
    setFormData(prev => ({ ...prev, mood }))
  }
  
  const toggleActivity = (activity) => {
    setFormData(prev => {
      const activities = prev.activities || []
      return {
        ...prev,
        activities: activities.includes(activity)
          ? activities.filter(a => a !== activity)
          : [...activities, activity]
      }
    })
  }
  
  const addCustomActivity = () => {
    if (customActivity.trim() && !formData.activities.includes(customActivity.trim())) {
      setFormData(prev => ({
        ...prev,
        activities: [...(prev.activities || []), customActivity.trim()]
      }))
      setCustomActivity('')
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="input"
          placeholder="Give your entry a title"
        />
      </div>
      
      {/* Mood Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          How are you feeling today?
        </label>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => handleMoodSelect(mood.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all ${
                formData.mood === mood.id 
                  ? mood.color + ' ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-neutral-900' 
                  : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <span>{mood.icon}</span>
              <span>{mood.label}</span>
              {formData.mood === mood.id && <FiCheck className="ml-1" />}
            </button>
          ))}
        </div>
      </div>
      
      {/* Activities */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Activities (optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonActivities.map(activity => (
            <button
              key={activity}
              type="button"
              onClick={() => toggleActivity(activity)}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                formData.activities?.includes(activity)
                  ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-200 ring-1 ring-secondary-400'
                  : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {activity}
            </button>
          ))}
          
          {formData.activities?.filter(a => !commonActivities.includes(a)).map(activity => (
            <button
              key={activity}
              type="button"
              onClick={() => toggleActivity(activity)}
              className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-200 px-3 py-1 text-sm rounded-full ring-1 ring-secondary-400"
            >
              {activity}
            </button>
          ))}
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={customActivity}
            onChange={(e) => setCustomActivity(e.target.value)}
            className="input rounded-r-none flex-1"
            placeholder="Add custom activity"
          />
          <button
            type="button"
            onClick={addCustomActivity}
            className="btn btn-primary rounded-l-none px-3"
            disabled={!customActivity.trim()}
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Journal Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Journal Entry
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          className="input min-h-[200px]"
          placeholder="Write your thoughts here..."
        />
      </div>
      
      {/* Submit Button */}
      <div>
        <button type="submit" className="btn btn-primary w-full">
          {initialData.id ? 'Save Changes' : 'Create Entry'}
        </button>
      </div>
    </form>
  )
}

export default EntryForm