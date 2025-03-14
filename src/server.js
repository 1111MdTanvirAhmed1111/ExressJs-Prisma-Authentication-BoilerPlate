require('module-alias/register'); // Add this line
require('dotenv').config();
const express = require('express');
const { errorHandler, notFoundHandler } = require('@/utils/errorHandler'); // Updated
const authRoutes = require('@/routes/authRoutes'); // Updated
const fileRoutes = require('@/routes/fileRoutes'); // Updated
const messageRoutes = require('@/routes/messageRoutes'); // Updated

const app = express();

app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
