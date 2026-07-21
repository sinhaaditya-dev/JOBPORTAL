const express = require('express')
const router = express.Router();

const {getDashboardStats, getRecentJobs,getRecentApplications} = require("../controllers/dashboardController")
const{protect,authorizeRecruiter, } = require("../middleware/authMiddleware")

router.get('/stats',protect,authorizeRecruiter, getDashboardStats) //only recruiter can see their dashboard not student
router.get('/recent-jobs',protect,authorizeRecruiter,getRecentJobs) //This will show the recents jobs of the recruiter
router.get('/recent-applications' , protect,authorizeRecruiter,getRecentApplications)

module.exports = router;