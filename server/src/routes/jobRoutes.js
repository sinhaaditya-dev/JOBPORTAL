const express = require('express');
const router = express.Router();
const { createJob,getAllJobs, getMyJobs,getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorizeRecruiter } = require('../middleware/authMiddleware');
const {uploadLogo} = require('../middleware/logoUploadMiddleware')
const {uploadCompanyLogo} = require('../controllers/uploadCompanyLogoController')
const { updateMany } = require('../models/User');

router.post('/', protect, authorizeRecruiter, createJob);
router.get('/',getAllJobs); //public API no login required
router.get("/myjobs", protect, authorizeRecruiter, getMyJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, authorizeRecruiter, updateJob)
router.delete("/:id", protect, authorizeRecruiter, deleteJob)
router.put("/:jobId/upload-logo",protect,authorizeRecruiter,uploadLogo.single('logo'),uploadCompanyLogo)
module.exports = router;