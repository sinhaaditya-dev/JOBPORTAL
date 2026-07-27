const User = require('../models/User');
const Job = require('../models/Job')

const savedJob = async(req,res) =>{
    try{
        //STEP 1
        //Find logged in user
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found,"
            })
        }
        //STEP 2
        //Find Job
        const job = await Job.findById(req.params.jobId)
        if(!job){
            return res.status(404).json({
                success:false,
                message:"Job Not found"
            })
        }

        //STEP 3
        //Check Already saved
        const alreadySaved = user.savedJobs.includes(job._id)
        if(alreadySaved){
            return res.status(400).json({
                success:false,
                message:"Job already Saved."
            })
        }

        //STEP 4
        //Save Job
        user.savedJobs.push(job._id)

        //STEP 5
        //Save user
        //This line is to save data in database permanently
        await user.save();

        //STEP 6
        //Success Response
        return res.status(200).json({
            success:true,
            message:"Job saved successfully.",
            savedJobs:user.savedJobs
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const removeSavedJob = async(req,res) =>{
    try{
        // Step 1
        // Find Logged In User
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

         // Step 2
        // Check Job Exists In Saved List
        //req.params.jobId is string but jobId stored in mongoose is an object 
        const jobExists = user.savedJobs.some(
            job => job.toString() === req.params.jobId
        )
        if(!jobExists){
            return res.status(404).json({
                success:false,
                message:"Saved job Not found."
            })
        }

        // Step 3
        // Remove Job

        user.savedJobs = user.savedJobs.filter(
            //we used .toString because in database it is stored in the form of object but req.params.jobId is String
            job => job.toString() !== req.params.jobId
        );

         // Step 4
        // Save User
        await user.save();
        
        //Step 5
        //Success Response
        return res.status(200).json({
            success:true,
            message:"Saved Jobs removed Successfully.",
            savedJobs:user.savedJobs
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

const getSavedJob = async(req,res) =>{
    try{
         // Step 1
        // Find Logged In User
        //We used populate because in database it stored ids but frontend needs title,company,salary,etc
        const user = await User.findById(req.user.id)
        .populate("savedJobs","title company location salary jobType isActive")
         if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
         }
        
        // Step 2
        // Response
        return res.status(200).json({
            success:true,
            totalSavedJobs:user.savedJobs.length,
            savedJobs:user.savedJobs
});
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    savedJob,
    removeSavedJob,
    getSavedJob
}