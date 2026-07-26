const upload = require('../middleware/resumeUploadMiddleware');
const express = require('express');
const router = express.Router();

const { uploadResume, deleteResume, updateProfile } = require('../controllers/userController');
const { protect, authorizeStudent } = require('../middleware/authMiddleware');    


router.put('/upload-resume', protect, authorizeStudent, upload.single('resume'), uploadResume);
router.delete('/delete-resume', protect, authorizeStudent, deleteResume);
router.put('/profile', protect, updateProfile);
module.exports = router;
