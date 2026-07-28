const {analyzeResume} = require("../services/geminiService");
const User = require("../models/User")
const axios = require('axios')
const pdf = require('pdf-parse')
// Analyze Resume

const analyzeResumeController = async (req, res) => {

    try {

        // Step 1
        // Find Logged In User
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        // Step 2
        // Check Resume Exists
        if(!user.resume || !user.resume.url){
            return res.status(400).json({
                success:false,
                message:"Please! upload your resume first."
            })
        }
        // Step 3
        // Download Resume
        const resumeResponse = await axios.get(user.resume.url,{
            //arraybuffer because pdf files are binary files,if we don't write arraybuffer the downloaded pdf will be corrupt//
            responseType: "arraybuffer"
        });

        // Step 4
        // Extract Text
        const pdfData = await pdf(resumeResponse.data);
        const resumeText = pdfData.text;

        // Step 5
        // Analyze Resume using Gemini
        //send resume text to gemini and recieve structures JSON report from gemini
        const aiReport = await analyzeResume(resumeText);

        //STEP 6
        //Save AI report in database
        user.aiReport = {
            ...aiReport,
            updatedAt: new Date()
        }

        //STEP 7
        //Save User
        await user.save();
        // Step 8
        // Response
        return res.status(200).json({
            success: true,
            message:"Resume Analyzed Successfully",
            aiReport:user.aiReport
        });
    }

    catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

}

const generateAIRejectionFeedbackController = async (req, res) => {
    try {
        const { applicationId } = req.body;
        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required"
            });
        }

        const Application = require("../models/Application");
        const Job = require("../models/Job");
        const { generateAIRejectionFeedback } = require("../services/geminiService");

        const application = await Application.findById(applicationId).populate("applicant").populate("job");
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        const job = application.job;
        const applicant = application.applicant;

        const jobTitle = job.title;
        const jobDescription = job.description || "";
        const candidateName = applicant.name || "Candidate";
        const candidateSkills = applicant.skills || [];
        const candidateMissingSkills = applicant.aiReport?.missingSkills || [];

        const feedback = await generateAIRejectionFeedback(
            jobTitle, 
            jobDescription, 
            candidateName, 
            candidateSkills, 
            candidateMissingSkills
        );

        return res.status(200).json({
            success: true,
            feedback
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    analyzeResumeController,
    generateAIRejectionFeedbackController
}