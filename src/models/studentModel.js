const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        required:true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = mongoose.model("Student", studentSchema)