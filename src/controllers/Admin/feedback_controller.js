import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Feedback } from "../../models/Admin/feedback_model.js";
import { User } from "../../models/web/user_model.js";

const uploadfeedback = asyncHandler(async (req, res) => {
    const { description, status } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }
    try {
        if ([description].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "feedback Required");
        }

        const feedback = await Feedback.create({
            description: description.toLowerCase(),
            status,
            user: userId
        });

        const createfeedback = await Feedback.findById(feedback._id);

        if (!createfeedback) {
            throw new ApiError(500, "Something went wrong while creating feedback");
        }

        return res
            .status(201)
            .json(
                new ApiResponse(200, "feedback create Successfully", createfeedback),
            );
    } catch (error) {
        return res
            .status(error.statusCode || 500)
            .json(new ApiResponse(error.statusCode || 500, error.message));
    }
});

// get all feedback
const getallfeedback = asyncHandler(async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            query,
            sortBy,
            sortType,
            feedbackId, 
        } = req.query;
        const filter = {};
        if (feedbackId) {
            filter.feedbackId = feedbackId;
        }
        const feedbacks = await Feedback.find(filter)
            .populate("user", "Name email phone")
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ [sortBy]: sortType === "desc" ? -1 : 1 });
        if (!feedbacks || feedbacks.length === 0) {
            throw new ApiError(404, "No feedbacks found");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, "All feedbacks fetched successfully", feedbacks),
            );
    } catch (error) {
        return res
            .status(error.statusCode || 500)
            .json(new ApiResponse(error.statusCode || 500, error.message));
    }
});

// getsingle feedback
const getSinglefeedback = asyncHandler(async (req, res) => {
    try {
        const feedback_id = req.params.id;
        const feedback = await Feedback.findById(feedback_id).select("-__v");
        if (!feedback) {
            throw new ApiError(404, "feedback not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "feedback fetched successfully", feedback));
    } catch (error) {
        return res
            .status(error.statusCode || 500)
            .json(new ApiResponse(error.statusCode || 500, error.message));
    }
});
// update status
const updatestatus = asyncHandler(async (req, res) => {
    const feedback_id = req.params.id;
    const { status } = req.body;
    try {
        if (status === undefined) {
            throw new ApiError(400, "Status is required");
        }
        if (typeof status !== "boolean") {
            throw new ApiError(400, "Status must be a boolean value");
        }
        // Update the feedback
        const feedback = await Feedback.findByIdAndUpdate(
            feedback_id,
            { $set: { status } },
            { new: true },
        ).select("status");
        if (!feedback) {
            throw new ApiError(404, "feedback not found");
        }
        // Return the updated feedback
        return res
            .status(200)
            .json(
                new ApiResponse(200, "feedback status updated successfully", feedback),
            );
    } catch (error) {
        return res
            .status(error.statusCode || 500)
            .json(new ApiResponse(error.statusCode || 500, error.message));
    }
});

// delete feedback
const deletefeedback = asyncHandler(async (req, res) => {
    try {
        const feedback_id = req.params.id;
        const feedback = await Feedback.findByIdAndDelete(feedback_id);

        if (!feedback) {
            throw new ApiError(404, "feedback not found to delete");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "feedback delete successfully"));
    } catch (error) {
        return res
            .status(error.statusCode || 500)
            .json(new ApiResponse(error.statusCode || 500, error.message));
    }
});

export {
    uploadfeedback,
    getallfeedback,
    deletefeedback,
    getSinglefeedback,
    updatestatus,
};
