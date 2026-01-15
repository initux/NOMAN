
# JSON File CRUD SPA

A task management application built with React and Node.js/Express, featuring atomic JSON file persistence.

## Features
- Full CRUD operations.
- Search and status filtering.
- Sort by creation date (newest first).
- Atomic file writing logic (prevents data corruption).
- Simple in-memory locking for concurrent requests.
- Tailwind CSS for modern design.

## Prerequisites
- Node.js (v16+)
- npm

## Setup Instructions

### 1. Server Setup
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:5000`.

### 2. Client Setup
```bash
# In a separate terminal
npm install
npm run dev
```
The client will run on `http://localhost:5173`. (Ensure the browser connects to the dev server).

## API Documentation

### Base URL: `/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks (supports `?q=`, `?status=`) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update existing task |
| DELETE | `/api/tasks/:id` | Delete task |

### Example cURL Requests

**Create a task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
-H "Content-Type: application/json" \
-d '{"title": "Buy groceries", "description": "Milk, bread, and eggs", "status": "pending"}'
```

**Get filtered tasks:**
```bash
curl "http://localhost:5000/api/tasks?q=grocery&status=pending"
```

## Database Storage
Data is persisted in `server/data/tasks.json`. On the first run, the folder and file are automatically created with seed data if they don't exist.
