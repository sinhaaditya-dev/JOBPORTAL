const Application = require('../models/Application');
const Job = require('../models/Job');
const applyForJob = async (req, res) => {
    try {
        const {coverLetter} = req.body;
        const {jobId} = req.params;
        const job = await Job.findById(jobId);
        // check if the job exists
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ applicant: req.user.id, job: jobId });
        if(existingApplication){
            return res.status(400).json({
                success:false,
                message:"You have already applied for the job."
            })
        }
        // create a new application
        const application = await Application.create({
            applicant:req.user.id,
            job:jobId,
            coverLetter:req.body.coverLetter
        });
         return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyApplications = async(req,res) =>{
    try{
        const applications = await Application.find({
            applicant:req.user.id
        }).populate({
            path:"job",
            select:"title company location salary jobType experience isActive applicationDeadline",
            populate:{
                path:"postedBy",
                select:"name email"
            }
        })
        .sort({
            createdAt:-1
        });
        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const withdrawApplication = async (req, res) => {
    try {

        // Step 1: Find Application
        const application = await Application.findById(req.params.applicationId);
        // Step 2: Check Exists
        if(!application){
            return res.status(404).json({
                success:false,
                message:"Application not found"
            })
        }
        // Step 3: Check Owner
        if(application.applicant.toString() !== req.user.id){
            return res.status(401).json({
                success:false,
                message:"You are not authorized to withdraw this application"
            })
        }

        // Step 4: Delete
         await application.deleteOne();
        // Step 5: Success Response
        return res.status(200).json({
            success:true,
            message:"Application withdrawn successfully",
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    applyForJob,
    getMyApplications,
    withdrawApplication,
};