const express = require('express');
const router = express.Router();
const { chatWithAssistant, getChatSuggestions } = require('../controllers/chatbotController');

// Public routes
router.post('/message', chatWithAssistant);
router.get('/suggestions', getChatSuggestions);

module.exports = router;
