const express = require('express');

const router = express.Router();

const {applyForJob,getMyApplications,withdrawApplication,getApplicantsForJob} = require("../controllers/applicationController");
const {protect,authorizeStudent,authorizeRecruiter} = require('../middleware/authMiddleware')

router.get('/myapplications',protect,authorizeStudent,getMyApplications)
router.delete('/:applicationId',protect,authorizeStudent,withdrawApplication)
router.post('/:jobId',protect,authorizeStudent,applyForJob)
router.get('/job/:jobId',protect,authorizeRecruiter,getApplicantsForJob)

module.exports = router;