const express = require('express');
const { getUserMessages, sendMessage } = require('@/controllers/messageController'); // Updated
const authMiddleware = require('@/middleware/authMiddleware'); // Updated
const router = express.Router();

router.use(authMiddleware);
router.get('/', getUserMessages);
router.post('/send', sendMessage);

module.exports = router;