const upload = require('../middleware/profilePictureUploadMiddleware')
const express = require('express')
const router = express.Router()

const {uploadProfilePicture,deleteProfilePicture} = require('../controllers/profilePictureController');
const { protect} = require('../middleware/authMiddleware');
//upload profile picture
router.put("/upload-avatar",protect,upload.single("avatar"),uploadProfilePicture);
//delete profile picture
router.delete("/delete-avatar",protect,deleteProfilePicture)
module.exports = router;