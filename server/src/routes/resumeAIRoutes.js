const express = require('express')
const router = express.Router();

const{protect} = require('../middleware/authMiddleware')
const {analyzeResumeController} = require('../controllers/resumeAIController')

router.post('/analyze', protect, analyzeResumeController)
module.exports = router;