import { useState, useEffect } from 'react';
import { FiTrash2, FiCheckCircle } from 'react-icons/fi';

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { text: input, completed: false }]);
    setInput('');
  };

  const toggleTask = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-neutral-800 dark:text-neutral-100">To-Do List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-l-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          placeholder="Add a task..."
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700"
        >
          Add
        </button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span
              onClick={() => toggleTask(index)}
              className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
            >
              {task.text}
            </span>
            <div className="flex gap-2">
              <FiCheckCircle
                className="text-green-500 cursor-pointer hover:text-green-700"
                onClick={() => toggleTask(index)}
              />
              <FiTrash2
                className="text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => deleteTask(index)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;