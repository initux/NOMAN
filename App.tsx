
import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, FetchTasksParams } from './types';
import { api } from './api';
import { TaskForm } from './components/TaskForm';
import { TaskTable } from './components/TaskTable';
import { TaskEditModal } from './components/TaskEditModal';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters and Sort State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: FetchTasksParams = {
        q: search || undefined,
        status: statusFilter || undefined,
        sort: 'createdAt_desc',
      };
      const response = await api.getTasks(params);
      if (response.success) {
        setTasks(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const handleCreateTask = async (title: string, description: string, status: TaskStatus) => {
    setIsSubmitting(true);
    try {
      const response = await api.createTask({ title, description, status });
      if (response.success) {
        loadTasks();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await api.updateTask(id, updates);
      if (response.success) {
        loadTasks();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await api.deleteTask(id);
      if (response.success) {
        loadTasks();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <div className="text-sm font-medium text-slate-500">
            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <TaskTable
          tasks={tasks}
          isLoading={loading}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
        />
      </main>

      <TaskEditModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
      />
    </div>
  );
};

export default App;
