const Job = require("../models/Job")
const Application = require("../models/Application");
const { trusted } = require("mongoose");

const getDashboardStats = async (req, res) => {
    try {

        // Step 1
        // Total Jobs
        const totalJobs = await Job.countDocuments({
            postedBy:req.user.id
        });

        // Step 2
        // Active Jobs
        const activeJobs = await Job.countDocuments({
            postedBy:req.user.id,
            isActive:true
        })
        // Step 3
        // Closed Jobs
        const closedJobs = await Job.countDocuments({
            postedBy:req.user.id,
            isActive:false
        })
        // Step 4
        // Total Applicants
        // Here we optimized the query by finding all the jobIds first then all applications rather than looping on each job//
        //loopiing is not a good option because if a recruiter have 500 jobs , then 500 datatbase query which will work very slowly  
        //Find all jobs of recruiter and only find the JobID not complete details
        const recruiterJobs = await Job.find({
        postedBy: req.user.id
        }).select("_id");

        //Fetch the jobIds only and store 
        const jobIds = recruiterJobs.map(job => job._id);

        const totalApplicants = await Application.countDocuments({
            // Count all applications whose job is one of these IDs.
            job: {
                $in: jobIds
            }
        });
        // Step 5
        // Response
        return res.status(200).json({
            success:true,
            stats:{
                totalJobs,
                activeJobs,
                closedJobs,
                totalApplicants
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getRecentJobs = async(req,res) =>{
    try{
            // Step 1
            //Total jobs of recruiter
            const totalJobs = await Job.countDocuments({
                postedBy:req.user.id
            })
            // Find recruiter's jobs
            const recentJobs = await Job.find({
                postedBy:req.user.id,
            })
            .select(
                "title company location isActive createdAt"
            )

            // Step 2
            // Latest first
            .sort({
                createdAt:-1
            })
            // Step 3
            // Return only 5 jobs
            .limit(5)
            // Step 4
            // Response
            return res.status(200).json({
                success:true,
                totalJobs, // It show the total jobs of the recruiter
                count:recentJobs.length, //it will only count the current latest jobs ,maximum 5
                jobs: recentJobs
            })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getRecentApplications = async(req,res) =>{
    try{
        // Step 1
        // Find recruiter's jobs
        const recruiterJobs = await Job.find({
            postedBy:req.user.id
        }).select("_id");
        // Step 2
        // Extract Job IDs
        const jobIds = recruiterJobs.map(job => job._id);
        // Step 3
        // Find latest applications
        const recentApplications = await Application.find({
            job: {
                $in:jobIds
            }
        })
        .populate("applicant","name email")
        .populate("job", "title company")
        .sort({
            createdAt:-1
        })
        .limit(5) //only recent 5 applications
        // Step 4
        // Response
        return res.status(200).json({
            success:true,
            count:recentApplications.length,
            applications:recentApplications
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    getDashboardStats,
    getRecentJobs,
    getRecentApplications
};