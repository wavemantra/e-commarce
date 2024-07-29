import mongoose, { Schema } from "mongoose";

const feedback = new Schema(
    {
        description: {
            type: String,
        },
        status: {
            type: Boolean,
            default: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

export const Feedback = mongoose.model("Feedback", feedback);
