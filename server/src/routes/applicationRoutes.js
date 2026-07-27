const express = require('express');

const router = express.Router();

const {applyForJob,getMyApplications,withdrawApplication,getApplicantsForJob} = require("../controllers/applicationController");
const {protect,authorizeStudent} = require('../middleware/authMiddleware')

router.get('/myapplications',protect,authorizeStudent,getMyApplications)
router.delete('/:applicationId',protect,authorizeStudent,withdrawApplication)
router.post('/:jobId',protect,authorizeStudent,applyForJob)

module.exports = router;