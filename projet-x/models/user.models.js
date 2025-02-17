import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-Unique-Validator";

const userSchema = mongoose.Schema({
    username: {
        type: string,
        required: true,
        unique: true,
    },

    email: {
        type: string,
        required: true,
        unique: true
    },
    password: {
        type: string,
        required: true
    },
    profilePicture: {
        type: String,
        default: "default-avatar.png"
    },
    bio: {
        type: String,
        maxLength: 160,
        default: ""
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.plugin(mongooseUniqueValidator);

export default mongoose.model("User", userSchema);
