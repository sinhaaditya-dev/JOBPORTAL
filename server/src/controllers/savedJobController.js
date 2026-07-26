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

module.exports = {
    savedJob
}