const express = require('express')
const router = express.Router();

const{getStudentDashboardStats} = require('../controllers/studentDashboardController')
const{protect,authorizeStudent} = require('../middleware/authMiddleware')

router.get('/stats',protect,authorizeStudent,getStudentDashboardStats)
module.exports=router;