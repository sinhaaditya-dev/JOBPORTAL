const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadCompanyLogo = async(req,res) =>{
    try{
         // Step 1
        // File Check
        if (!req.file) {
            return res.status(400).json({
            success: false,
            message: "Please upload a company logo"
            });
        }

        //Step 2
        //Job Find
        const job = await Job.findById(req.params.jobId)
        if(!job){
            return res.status(404).json({
            success:false,
            message:"Job not Found"
            })
        }

        //Step 3
        //Ownership check
        if(job.postedBy.toString() !== req.user.id){
            return res.status(401).json({
                success:false,
                message:"Not authorized to update this job"
            })
        }
        //if company logo already uploaded , first delete the previous logo and update
        if (job.companyLogo.public_id) {
            await cloudinary.uploader.destroy(
            job.companyLogo.public_id
            );
        } 

        //Step 4
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {
                folder: "jobportal/company-logos",
                resource_type: "image"
            },

            (error, result) => {

                if (error) return reject(error);

                resolve(result);

                }

        );

        streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);

        });

        //Step 5
        if (!job.companyLogo) {
            job.companyLogo = {};
        }
        job.companyLogo.public_id = uploadResult.public_id
        job.companyLogo.url = uploadResult.secure_url

        await job.save();

            return res.status(200).json({
            success: true,
            message: "Company logo uploaded successfully",
            companyLogo: job.companyLogo
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
    uploadCompanyLogo
}
   