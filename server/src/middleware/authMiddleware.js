
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {

    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  }
};
// Authorize recruiter middleware
const authorizeRecruiter = (req, res, next) => {
  if(req.user.role !== "recruiter"){
    return res.status(403).json({
      success:false,
      message:"Not authorized as a recruiter"
    })
  }
  next();
}

const authorizeStudent = (req,res,next) =>{
  if(req.user.role !== "student"){
    return res.status(403).json({
      success:false,
      message:"Only students are allowed to apply for jobs"
    })
  }
  next();
}

module.exports = { protect, authorizeRecruiter ,authorizeStudent};