const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Register User
const registerUser = async(req, res) =>{
    try{
        const{name, email, password, role} = req.body;
        // Validation
        if(!name || !email || !password || !role){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({
            success:false,
            message:"User already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            role
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message:error.message,
        });
    }
};

// Login User
const loginUser = async(req, res) =>{
    try{
        const { email, password } = req.body; //get user
        // Validation
        if (!email || !password) {
            return res.status(400).json({
            success: false,
            message: "Email and password are required",
            });
        }
        const user = await User.findOne({ email }); //Find User
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials",
            });
        }
        const isMatch = await bcrypt.compare(password , user.password); //compare password
        if (!isMatch) {
            return res.status(400).json({
            success: false,
            message: "Invalid Credentials",
            });
        }
        //generate jwttoken//
        const token = jwt.sign({
            id: user._id,
            role:user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
}
catch(error){
    res.status(500).json({
        success: false,
        message:error.message,
    })
}
}

// Get User Profile
const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}

//Logout User
const logoutUser = async(req,res) =>{
    try{
        return res.status(200).json({
            success:true,
            message:"User Logout Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    logoutUser
};