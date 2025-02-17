import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        title: {
        type: String,
        required: true,
        },
        content: {
        type: String,
        required: true,
        },
        imageUrl: {
        type: String,
        required: true,
        },
        userId: {
        type: String,
        required: true,
        },
        likes: {
        type: [String],
        default: [],
        required: true,
        },
    },
    { timestamps: { createdAt: true } }
    );
    export default mongoose.model('Post', postSchema);