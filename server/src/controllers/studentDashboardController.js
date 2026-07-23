const Application = require('../models/Application')
const User = require('../models/User')
const Job = require('../models/Job')
const getStudentDashboardStats = async(req,res) =>{
     try {

        // Step 1
        // Total Applications
        const totalApplications = await Application.countDocuments({
            applicant:req.user.id
        })
        // Step 2
        // Shortlisted Applications
        const acceptedCount = await Application.countDocuments({
            applicant:req.user.id,
            status:"accepted"
        }) 

        // Step 3
        // Pending Applications
        const pendingCount = await Application.countDocuments({
            applicant:req.user.id,
            status:"pending"
        })
        
        // Step 4
        // Rejected Applications
        const rejectedCount = await Application.countDocuments({
            applicant:req.user.id,
            status:"rejected"
        }) 
        // Step 5
        // Saved Jobs Count
        const student = await User.findById(req.user.id);
        const savedJobs = student?.savedJobs?.length || 0;
        // Step 6
        // Recent Applications
        const recentApplications =await Application.find({
            applicant:req.user.id
        })
        .populate("job","title company location status")
        .sort({
            createdAt:-1
        })
        .limit(5);
        // Step 7
        // Recommended Jobs
        const recommendedJobs = await Job.find({
            isActive:true
        })
        .select("title company location vacancies isActive postedBy")
        .sort({
            createdAt:-1
        })
        .limit(5)
        // Step 8
        // Response
        return res.status(200).json({
            success:true,
            dashboard:{
                totalApplications,
                acceptedCount,
                pendingCount,
                rejectedCount,
                savedJobs,
                recentApplications,
                recommendedJobs             
            }
        })

    }

    catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

}
module.exports = {
    getStudentDashboardStats
}