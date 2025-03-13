const { Server } = require('socket.io');
const prisma = require('@/config/database');

// In-memory mapping of database userId to socket.id
const users = {};

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // Adjust in production for security
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Handle user joining with their database userId
    socket.on('join', (userId) => {
      const parsedUserId = parseInt(userId);
      if (isNaN(parsedUserId) || parsedUserId <= 0) {
        console.error('Invalid userId provided:', userId);
        socket.emit('error', { message: 'Invalid userId. Must be a positive integer.' });
        return;
      }

      users[parsedUserId] = socket.id;
      console.log(`User ${parsedUserId} mapped to socket ${socket.id}`);
    });

    // Handle sending messages using database userIds
    socket.on('sendMessage', async (data) => {
      const { from, to, content } = data;

      try {
        // Validate inputs
        const parsedFrom = parseInt(from);
        const parsedTo = parseInt(to);
        if (isNaN(parsedFrom) || isNaN(parsedTo) || parsedFrom <= 0 || parsedTo <= 0) {
          throw new Error('Sender ID and Receiver ID must be positive integers');
        }
        if (!content || typeof content !== 'string' || content.trim() === '') {
          throw new Error('Message content is required and must be a non-empty string');
        }

        // Find or create a chat between 'from' and 'to'
        let chatting = await prisma.chatting.findFirst({
          where: {
            OR: [
              { from: parsedFrom, to: parsedTo },
              { from: parsedTo, to: parsedFrom },
            ],
          },
          include: { messages: true },
        });

        if (!chatting) {
          // Create new chat if it doesn’t exist
          chatting = await prisma.chatting.create({
            data: {
              from: parsedFrom,
              to: parsedTo,
              messages: {
                create: { messager: parsedFrom, content: content.trim() },
              },
            },
            include: { messages: true },
          });
        } else {
          // Add new message to existing chat
          await prisma.message.create({
            data: {
              messager: parsedFrom,
              content: content.trim(),
              chattingId: chatting.id,
            },
          });
          // Fetch updated chat with messages
          chatting = await prisma.chatting.findUnique({
            where: { id: chatting.id },
            include: { messages: true },
          });
        }

        // Emit to sender if online
        if (users[parsedFrom]) {
          io.to(users[parsedFrom]).emit('receivedMessage', {
            from: parsedFrom,
            to: parsedTo,
            content: content.trim(),
          });
          console.log(`Message sent to sender ${parsedFrom} at socket ${users[parsedFrom]}`);
        }

        // Emit to receiver if online
        if (users[parsedTo]) {
          io.to(users[parsedTo]).emit('receivedMessage', {
            from: parsedFrom,
            to: parsedTo,
            content: content.trim(),
          });
          console.log(`Message sent to receiver ${parsedTo} at socket ${users[parsedTo]}`);
        }

      } catch (error) {
        console.error('Error in sendMessage:', error.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Clean up when a socket disconnects
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          console.log(`User ${userId} removed from mapping`);
          break;
        }
      }
    });
  });

  return io;
}

module.exports = initializeSocket;