const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadResume = async (req, res) => {
    try {
        // Step 1
        // Check file exists
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"Please upload a PDF resume"
            })
        }

        // Step 2
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

        {
            folder: "jobportal/resumes",
            resource_type: "raw"
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

        // Step 3
        // Update User
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        user.resume.public_id = uploadResult.public_id;
        user.resume.url = uploadResult.secure_url;

        await user.save();
        // Step 4
        // Success Response
        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume:user.resume
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    uploadResume,
};