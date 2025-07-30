const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/supplychain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const Inventory = require('./models/Inventory');
const Order = require('./models/Order');

// Inventory and Orders Routes
const inventoryRoutes = require('./routes/inventory')(io);
const orderRoutes = require('./routes/orders')(io);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

// History Route
const historyRoutes = require('./routes/history')(io);
app.use('/api/history', historyRoutes);

// Authentication Routes
app.use('/api/auth', require('./routes/auth'));

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));