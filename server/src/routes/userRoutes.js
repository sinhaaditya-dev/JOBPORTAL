const upload = require('../middleware/resumeUploadMiddleware');
const express = require('express');
const router = express.Router();

const { uploadResume } = require('../controllers/userController');
const { protect, authorizeStudent } = require('../middleware/authMiddleware');    


router.put('/upload-resume', protect, authorizeStudent, upload.single('resume'), uploadResume);

module.exports = router;
