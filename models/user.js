const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    uuid: { 
        type: String, 
        required: true 
    },
    auth_role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true,
    },
    email: { 
        type: String, 
        required: true 
    },
    scope: { 
        type: [String], 
        required: true 
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);