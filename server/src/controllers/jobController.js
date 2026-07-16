const Job = require('../models/Job');

const createJob = async(req,res) =>{
    try{
        const{
            title,
            company,
            description,
            location,
            salary,
            skills,
            jobType,
            experience,
            vacancies,
            isActive,
            applicationDeadline
        } = req.body;

        if(!title || !company || !description || !location || !salary || !skills || !experience){
            return res.status(400).json({
                success:false,
                message:"Please provide all required fields"
            })
        }

        const job = await Job.create({
            title,
            company,
            description,
            location,
            salary,
            skills,
            jobType,
            experience,
            vacancies,
            isActive,
            applicationDeadline,
            // Recruiter ID from JWT middleware
            postedBy:req.user.id,
        });
        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job,
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getAllJobs = async(req,res) =>{
    try{
        const jobs = await Job.find({
            isActive:true,
        }).populate("postedBy", "name email").sort({
            createdAt:-1
        });
        res.status(200).json({
            success: true,
            count:jobs.length,
            jobs,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

const getMyJobs = async(req,res) =>{
    try{
        const jobs = await Job.find({
            postedBy:req.user.id,
        })
        .sort({
            createdAt:-1
        })
        .populate("postedBy", "name email");
        res.status(200).json({
            success:true,
            count:jobs.length,
            jobs,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

const getJobById = async(req,res) =>{
    try{
        const job = await Job.findById(req.params.id).populate("postedBy", "name email");
        if(!job){
            return res.status(404).json({
                success:false,
                message:"Job not found"
            })
        }
        res.status(200).json({
            success:true,
            job,
        });
        
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

const updateJob = async(req,res) =>{
    try{
        const job = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({
                success:false,
                message:"Job not found"
            })
        }
        // Check if the user is the owner of the job
        if(job.postedBy.toString() !== req.user.id){
            return res.status(403).json({
                success:false,
                message:"Not authorized to update this job"
            })
        }
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
        {
            new: true,
            runValidators: true,
        }
        );
        res.status(200).json({
            success: true,
            job: updatedJob,
            message: "Job updated successfully"
        });
    }
    
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

const deleteJob = async(req,res) =>{
    try{
        const job = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({
                success:false,
                message:"Job not found"
            })
        }
        // Check if the user is the owner of the job
        if(job.postedBy.toString() !== req.user.id){
            return res.status(403).json({
                success:false,
                message:"Not authorized to delete this job"
            })
        }
        const deletedJob = await job.deleteOne();
        res.status(200).json({
            success: true,
            job: deletedJob,
            message: "Job deleted successfully"
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
module.exports = { createJob , getAllJobs, getMyJobs, getJobById, updateJob, deleteJob };