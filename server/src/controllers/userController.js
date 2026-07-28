const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

//Upload Resume
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
            resource_type: "auto",
            use_filename: true,
            unique_filename: true
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
        user.resumeName = req.file.originalname;

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

//Delete Resume
const deleteResume = async (req, res) => {
    try {

        // Step 1
        // Find Logged In User
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        // Step 2
        // Check Resume Exists
        if(!user.resume || !user.resume.public_id){
            return res.status(404).json({
                success:false,
                message: "Resume not found."
            })
        }
        // Step 3
        // Delete Resume from Cloudinary
        await cloudinary.uploader.destroy(user.resume.public_id);
        // Step 4
        // Remove Resume from Database
        user.resume = {
            public_id:"",
            url:""
        };
        user.resumeName = "";
        user.aiReport = {
            atsScore: 0,
            summary: [],
            skills: [],
            missingSkills: [],
            strengths: [],
            weaknesses: [],
            recommendations: []
        };
        // Step 5
        // Save User
        await user.save();
        // Step 6
        // Send Success Response
        return res.status(200).json({
            success: true,
            message: "Resume deleted successfully",
            user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update Profile details
const updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    uploadResume,
    deleteResume,
    updateProfile
};