const mongoose = require('mongoose');

const JobSchema  = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    company:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    location:{
        type:String
    },
    salary:{
        min:{
            type:Number,
        },
        max:{
            type:Number,
        }
    },
    skills:{
        type:[String]
    },
    jobType:{
        type:String,
        enum:["full-time", "part-time", "contract", "internship"],
        default:"full-time"
    },
    experience:{
        type:String,
        enum:["Fresher", "1-2 Years","2-4 Years","4-6 Years","6+ Years"],
        default:"Fresher"
    },
    vacancies:{
        type:Number,
        default:1,
        min:1
    },
    isActive:{
        type:Boolean,
        default:true
    },
    applicationDeadline:{
        type:Date
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    companyLogo: {
        public_id: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        }
    },

},
{
    timestamps:true
}
);

module.exports = mongoose.model("Job", JobSchema);