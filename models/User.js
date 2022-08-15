const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, unique: false },
        lastName: { type: String, required: true, unique: false },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        profileImg: { type: String, required: false },
        lastLogin: { type: String, default: new Date().toISOString() }
    },
    { timestamps: true }
)

UserSchema.statics.login = function login(id, cb) {
    const lastLoginDate = new Date().toISOString()
    return this.findByIdAndUpdate(id,{'$set' : { 'lastLogin' : lastLoginDate} }, { new : true }, cb);
 }

module.exports = mongoose.model("User", UserSchema)