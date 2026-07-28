const express = require('express');
const router = express.Router();
const {protect,authorizeStudent} = require('../middleware/authMiddleware')
const {savedJob,removeSavedJob,getSavedJob} = require('../controllers/savedJobController')
//Save job API
router.post('/:jobId', protect,authorizeStudent, savedJob)
//Delete saved Job API
router.delete('/:jobId',protect, authorizeStudent, removeSavedJob)
//get All saved Job API
router.get('/',protect, authorizeStudent,getSavedJob)
module.exports = router;