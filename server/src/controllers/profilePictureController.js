const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Upload Profile Picture
const uploadProfilePicture = async (req, res) => {

    try {

        // Step 1
        // Check Image Exists

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a profile picture"
            });
        }

        // Step 2
        // Find Logged In User

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Step 3
        // Delete Old Image (if exists)

        if (user.avatar && user.avatar.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        // Step 4
        // Upload New Image To Cloudinary

        const uploadResult = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(

                {
                    folder: "jobportal/profile-pictures",
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

        // Step 5
        // Save Avatar In Database

        user.avatar = {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url
        };

        // Step 6
        // Save User

        await user.save();

        // Step 7
        // Success Response

        return res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            avatar: user.avatar
        });

    }

    catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

//Delete Profile Picture
const deleteProfilePicture = async(req,res) =>{
    try{
        //STEP 1 
        //Find logged in user
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        //STEP 2
        //Check profile picture exists
        if(!user.avatar || !user.avatar.public_id){
            return res.status(404).json({
                success:false,
                message:"Profile picture not found"
            })
        }
        //STEP 3
        //Delete profile picture from cloudinary
        await cloudinary.uploader.destroy(user.avatar.public_id)

        //STEP 4
        //Delete from Database
        user.avatar = {
            public_id:"",
            url:""
        }

        //STEP 5
        //Save user
        await user.save();

        //STEP 6
        //Success response
        return res.status(200).json({
            success:true,
            message:"Profile picture deleted Successfully"
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
    uploadProfilePicture,
    deleteProfilePicture
};