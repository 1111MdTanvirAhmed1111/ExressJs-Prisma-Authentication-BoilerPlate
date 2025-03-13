require('module-alias/register'); // Add this line
require('dotenv').config();
const express = require('express');
const http = require('http');
const initializeSocket = require('@/config/socket'); // Updated
const authRoutes = require('@/routes/authRoutes'); // Updated
const fileRoutes = require('@/routes/fileRoutes'); // Updated
const messageRoutes = require('@/routes/messageRoutes'); // Updated
const { errorHandler, notFoundHandler } = require('@/utils/errorHandler'); // Updated

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});