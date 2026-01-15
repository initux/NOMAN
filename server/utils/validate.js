
const validateTask = (task) => {
  const errors = [];

  if (!task.title || typeof task.title !== 'string' || task.title.trim().length < 2) {
    errors.push('Title is required and must be at least 2 characters.');
  }

  if (task.status && !['pending', 'done'].includes(task.status)) {
    errors.push('Status must be "pending" or "done".');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateTask };
