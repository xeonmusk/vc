const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const WebSocket = require('ws');
const http = require('http');

const authRoute = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const taskRoutes = require('./routes/taskRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('common'));
app.use(express.json());

const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { validateRegister, validateInventory, validateTask } = require('./middleware/validateInput');
const requestLogger = require('./middleware/requestLogger');
const cacheMiddleware = require('./middleware/cache');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: process.env.UPLOAD_PATH || './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Add request logging
app.use(requestLogger);

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoute);
app.use('/api/protected', protectedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

// Routes with validation
app.use('/api/auth/register', validateRegister);
app.use('/api/inventory', validateInventory);
app.use('/api/tasks', validateTask);

// Apply cache to specific routes
app.use('/api/products', cacheMiddleware(300));
app.use('/api/inventory', cacheMiddleware(60));

// Add file upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});

// MongoDB connection with retry logic
const connectWithRetry = async (retries = 5, interval = 5000) => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase';
  
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      if (i === retries - 1) {
        console.error('\nFailed to connect to MongoDB. Please ensure that:');
        console.error('1. MongoDB is installed (run "mongod --version" to check)');
        console.error('2. MongoDB service is running');
        console.error('3. MongoDB connection URL is correct\n');
        console.error('Error details:', err);
        process.exit(1);
      }
      console.log(`Connection attempt ${i + 1} failed. Retrying in ${interval/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

// Replace existing mongoose.connect with connectWithRetry
connectWithRetry();

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle unhandled routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// WebSocket server setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  // Send initial connection status
  ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      switch(data.type) {
        case 'notification_read':
          // Handle notification read status
          break;
        case 'task_update':
          // Broadcast task updates to all clients
          wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data));
            }
          });
          break;
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Enhanced WebSocket error handling
wss.on('error', (error) => {
  console.error('WebSocket Server Error:', error);
});

process.on('SIGTERM', () => {
  wss.close(() => {
    console.log('WebSocket server terminated');
  });
});

// Error handler should be last middleware
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
