
import React, { useState } from 'react';
import { TaskStatus } from '../types';

interface TaskFormProps {
  onSubmit: (title: string, description: string, status: TaskStatus) => Promise<void>;
  isSubmitting: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 2) return;
    await onSubmit(title, description, status);
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Create New Task</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            minLength={2}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-[42px]"
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details..."
            rows={3}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || title.length < 2}
        className="mt-6 w-full md:w-auto px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-200"
      >
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};
