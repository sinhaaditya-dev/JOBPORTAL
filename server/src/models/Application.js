const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    status:{
        type:String,
        enum:["pending", "accepted", "rejected"],
        default:"pending"
    },
    coverLetter:{
        type:String,
        trim:true
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model("Application", ApplicationSchema);