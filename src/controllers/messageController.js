const prisma = require('@/config/database'); // Updated

const getUserMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: { id: true, email: true, name: true },
        },
        receiver: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    res.json({
      status: 'success',
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId: parseInt(receiverId),
      },
    });

    res.status(201).json({
      status: 'success',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserMessages, sendMessage };