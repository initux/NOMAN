
const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/tasks.json');
const DATA_DIR = path.dirname(DB_PATH);

// Simple mutex/lock to prevent concurrent writes
let isLocked = false;
const queue = [];

const processQueue = async () => {
  if (isLocked || queue.length === 0) return;
  isLocked = true;
  const { operation, resolve, reject } = queue.shift();
  try {
    const result = await operation();
    resolve(result);
  } catch (err) {
    reject(err);
  } finally {
    isLocked = false;
    processQueue();
  }
};

const withLock = (operation) => {
  return new Promise((resolve, reject) => {
    queue.push({ operation, resolve, reject });
    processQueue();
  });
};

const seedData = [
  {
    id: 'seed-1',
    title: 'Welcome to TaskFlow',
    description: 'Create, update, and delete tasks with ease.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'seed-2',
    title: 'File Persistence',
    description: 'Your data is saved in a local JSON file.',
    status: 'done',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'seed-3',
    title: 'Atomic Writes',
    description: 'The backend ensures data integrity during save operations.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const fileDb = {
  async init() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        await fs.access(DB_PATH);
      } catch {
        // Create file with seed data if it doesn't exist
        await fs.writeFile(DB_PATH, JSON.stringify(seedData, null, 2), 'utf8');
      }
    } catch (err) {
      console.error('Failed to initialize database folder:', err);
    }
  },

  async read() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  },

  async write(tasks) {
    return withLock(async () => {
      const tempPath = `${DB_PATH}.tmp`;
      const data = JSON.stringify(tasks, null, 2);
      await fs.writeFile(tempPath, data, 'utf8');
      await fs.rename(tempPath, DB_PATH);
      return tasks;
    });
  }
};

module.exports = fileDb;
