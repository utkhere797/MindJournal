import { useState, useEffect } from 'react'
import { FiCheck, FiSmile, FiMeh, FiFrown, FiUpload, FiX } from 'react-icons/fi'

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
    images: [],
    ...initialData
  })
  
  const [customActivity, setCustomActivity] = useState('')
  const [imagePreviews, setImagePreviews] = useState(initialData.images || [])
  
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
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const imageToRemove = formData.images[index];
    // If it's a file object, revoke its URL
    if (imageToRemove instanceof File) {
      const previewToRemove = imagePreviews[index];
      URL.revokeObjectURL(previewToRemove);
    }

    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });

    setImagePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Image Upload Logic ---
    const VITE_CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const VITE_UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

    if (!VITE_CLOUD_NAME || !VITE_UPLOAD_PRESET) {
      console.error("Cloudinary credentials are not set in .env file.");
      // You might want to show an error to the user here
      return;
    }

    const existingImageUrls = formData.images.filter(image => typeof image === 'string');
    const newImageFiles = formData.images.filter(image => image instanceof File);

    const uploadedImageUrls = [];
    const uploadPromises = newImageFiles.map(async (image) => {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', VITE_UPLOAD_PRESET);
      
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${VITE_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: data
        });
        const file = await res.json();
        if (file.secure_url) {
          uploadedImageUrls.push(file.secure_url);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        // Handle upload error for individual images if necessary
      }
    });

    await Promise.all(uploadPromises);

    // --- Prepare final form data ---
    const finalFormData = {
      ...formData,
      images: [...existingImageUrls, ...uploadedImageUrls],
    };

    onSubmit(finalFormData);
  };
  
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

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Attach Images
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FiUpload className="mx-auto h-12 w-12 text-neutral-400" />
            <div className="flex text-sm text-neutral-600 dark:text-neutral-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white dark:bg-neutral-900 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload files</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} accept="image/png, image/jpeg" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">PNG, JPG up to 5MB</p>
          </div>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img src={preview} alt={`preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
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
