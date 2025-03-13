const express = require('express');
const { getUserMessages, sendMessage } = require('@/controllers/messageController');
const authMiddleware = require('@/middleware/authMiddleware');
const { validate, schemas } = require('@/middleware/validationMiddleware');
const router = express.Router();

router.use(authMiddleware);

// No validation needed for GET (no user input)
router.get('/', getUserMessages);

// Validate body for POST
router.post('/send', validate(schemas.sendMessage), sendMessage);

module.exports = router;