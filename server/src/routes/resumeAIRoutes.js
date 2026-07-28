const express = require('express')
const router = express.Router();

const{protect} = require('../middleware/authMiddleware')
const {analyzeResumeController, generateAIRejectionFeedbackController} = require('../controllers/resumeAIController')

router.post('/analyze', protect, analyzeResumeController)
router.post('/rejection-feedback', protect, generateAIRejectionFeedbackController)
module.exports = router;