
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fileDb = require('../services/fileDb');
const { validateTask } = require('../utils/validate');

// Helper to wrap responses
const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { q, status, sort } = req.query;
    let tasks = await fileDb.read();

    // Search
    if (q) {
      const query = q.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query)
      );
    }

    // Status Filter
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    // Sort (default: newest first)
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sendResponse(res, 200, true, 'Tasks retrieved successfully', tasks);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const tasks = await fileDb.read();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return sendResponse(res, 404, false, 'Task not found');
    sendResponse(res, 200, true, 'Task found', task);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const validation = validateTask({ title, status });

    if (!validation.isValid) {
      return sendResponse(res, 400, false, validation.errors.join(', '));
    }

    const tasks = await fileDb.read();
    const newTask = {
      id: uuidv4(),
      title,
      description: description || '',
      status: status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await fileDb.write(tasks);

    sendResponse(res, 201, true, 'Task created successfully', newTask);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const tasks = await fileDb.read();
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) return sendResponse(res, 404, false, 'Task not found');

    const validation = validateTask({ title, status });
    if (!validation.isValid) {
      return sendResponse(res, 400, false, validation.errors.join(', '));
    }

    const updatedTask = {
      ...tasks[index],
      title,
      description,
      status,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    await fileDb.write(tasks);

    sendResponse(res, 200, true, 'Task updated successfully', updatedTask);
  } catch (err) {
    sendResponse(res, 500, false, 'Internal server error');
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const tasks = await fileDb.read();
    const filteredTasks = tasks.filter(t => t.id !== req.params.id);

    if (tasks.length === filteredTasks.length) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    await fileDb.write(filteredTasks);
    sendResponse(res, 200, true, 'Task deleted successfully');
  } catch (err) {
    sendResponse(res, 500, false, 'Internal server error');
  }
});

module.exports = router;
