const express = require('express');
const router = express.Router();
const {protect,authorizeStudent} = require('../middleware/authMiddleware')
const {savedJob} = require('../controllers/savedJobController')

router.post('/:jobId', protect,authorizeStudent, savedJob)

module.exports = router;