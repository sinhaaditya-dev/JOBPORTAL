const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ["student", "recruiter"],
        default: "student",
    },
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        }
    ],
    resume: {
        public_id: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        }
    },
    avatar: {
        public_id:{
            type:String,
            default:""
        },
        url:{
            type:String,
            default:""
        }
    },
    aiReport: {
        atsScore: Number,
        summary: [String],
        skills: [String],
        missingSkills: [String],
        strengths: [String],
        weaknesses: [String],
        recommendations: [String],
        updatedAt: Date
    }
}, 
{
    timestamps:true
}
);

module.exports = mongoose.model("User", UserSchema);