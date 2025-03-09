const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    collegeemail: { type: String, required: true, unique: true },
    backupemail: { type: String },
    password: { type: String, required: true },
    imageurl: { type: String },
    
    // OTP for email verification
    otp: { type: String },
    otpExpires: { type: Date },
    
    // Passcode for password reset
    resetPasscode: { type: String },
    resetPasscodeExpires: { type: Date },

    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
