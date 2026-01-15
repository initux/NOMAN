
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const fileDb = require('./services/fileDb');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
fileDb.init();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Unexpected server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
