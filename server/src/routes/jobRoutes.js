const express = require('express');
const router = express.Router();
const { createJob,getAllJobs, getMyJobs,getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorizeRecruiter } = require('../middleware/authMiddleware');
const { updateMany } = require('../models/User');

router.post('/', protect, authorizeRecruiter, createJob);
router.get('/',getAllJobs);
router.get("/myjobs", protect, authorizeRecruiter, getMyJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, authorizeRecruiter, updateJob)
router.delete("/:id", protect, authorizeRecruiter, deleteJob)
module.exports = router;