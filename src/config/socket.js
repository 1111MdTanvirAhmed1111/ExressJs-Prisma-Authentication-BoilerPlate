const { Server } = require('socket.io');
const prisma = require('@/config/database'); // Updated

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
      try {
        const message = await prisma.message.create({
          data: {
            content,
            senderId: parseInt(senderId),
            receiverId: parseInt(receiverId),
          },
        });

        io.to(senderId).to(receiverId).emit('newMessage', message);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;