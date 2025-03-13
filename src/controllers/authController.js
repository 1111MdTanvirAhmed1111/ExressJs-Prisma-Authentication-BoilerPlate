const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('@/config/database'); // Updated

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(201).json({
      status: 'success',
      data: { user: { id: user.id, email, name }, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({
      status: 'success',
      data: { user: { id: user.id, email, name: user.name }, token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };