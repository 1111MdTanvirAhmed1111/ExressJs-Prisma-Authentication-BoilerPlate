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
      const { senderId, receiverId, content } = data;
console.log(data)
      try {
        // Validate inputs
        const parsedSenderId = parseInt(senderId);
        const parsedReceiverId = parseInt(receiverId);
        if (isNaN(parsedSenderId) || isNaN(parsedReceiverId) || parsedSenderId <= 0 || parsedReceiverId <= 0) {
          throw new Error('Sender ID and Receiver ID must be positive integers');
        }
        if (!content || typeof content !== 'string' || content.trim() === '') {
          throw new Error('Message content is required and must be a non-empty string');
        }




        // Find or create a chat between 'senderId' and 'receiverId'
        let message = await prisma.messageSession.findFirst({
          where: {
            OR: [
              { senderId: parsedSenderId, receiverId: parsedReceiverId },
              { senderId: parsedReceiverId, receiverId: parsedSenderId },
            ],
          }
        });

        

        if (!message) {
          // Create new chat if it doesn’t exist
          message = await prisma.messageSession.create({
            data: {
              senderId: parsedSenderId,
              receiverId: parsedReceiverId,
              messages: {
                create: {messagerId: parsedSenderId, content: content.trim() },
              },
            },
          });
        } else {
          // Add new message to existing chat
          await prisma.message.create({
         
            data: {
              messagerId: parsedSenderId,
              session: message.id,
              content: content.trim(),
            },
          
          });
          // Fetch updated chat with messages
          message = await prisma.messageSession.findUnique({
            where: { id: message.id },
            include: { messages: true },
          });
        }

        // Emit to sender if online
        if (users[parsedSenderId]) {
          io.to(users[parsedSenderId]).emit('receivedMessage', {
            senderId: parsedSenderId,
            receiverId: parsedReceiverId,
            content: content.trim(),
          });
          console.log(`Message sent to sender ${parsedSenderId} at socket ${users[parsedSenderId]}`);
        }

        // Emit to receiver if online
        if (users[parsedReceiverId]) {
          io.to(users[parsedReceiverId]).emit('receivedMessage', {
            senderId: parsedSenderId,
            receiverId: parsedReceiverId,
            content: content.trim(),
          });
          console.log(`Message sent to receiver ${parsedReceiverId} at socket ${users[parsedReceiverId]}`);
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
