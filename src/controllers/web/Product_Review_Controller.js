import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ProductReview } from "../../models/web/Product_review_model.js";

const createReview = asyncHandler(async (req, res) => {
  try {
    const { productId, review } = req.body;
    const userID = req.user._id;
    if ([productId, review].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "all fileds are Required");
    }
    if (!userID) {
      throw new ApiError(400, "User is required");
    }
    const Review = await ProductReview.create({
      productId,
      review,
      userId: userID,
      totalReview
    });
    const CreateReview = await ProductReview.findById(Review._id);
    if (!CreateReview) {
      throw new ApiError(500, "Something went wrong while creating Review");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, "Review Submited Succefullly", CreateReview));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// get Reviews By ProductId  
const getReviewsByProductId = asyncHandler(async (req, res) => {
    try {
      const { productId } = req.params;
      if (!productId) {
        throw new ApiError(400, "Product ID is required");
      }
  
      const reviews = await ProductReview.find({ productId });
      const totalCount = await ProductReview.countDocuments({ productId });
  
      if (!reviews) {
        throw new ApiError(404, "No reviews found for this product");
      }
  
      return res.status(200).json(new ApiResponse(200, "Reviews fetched successfully", { reviews, totalCount }));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, error.message));
    }
  });
  
  // getsingle Review
const getSinglereview = asyncHandler(async (req, res) => {
    try {
      const review_id = req.params.id;
      const review = await ProductReview.findById(review_id).select("-__v");
      if (!review) {
        throw new ApiError(404, "Product Review not found");
      }
      return res
        .status(200)
        .json(new ApiResponse(200, "review fetched successfully", review));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, error.message));
    }
  });


  // delete review
const deletereview = asyncHandler(async (req, res) => {
    try {
      const review_id = req.params.id;
      const review = await ProductReview.findByIdAndDelete(review_id);
  
      if (!review) {
        throw new ApiError(404, "review not found to delete");
      }
  
      return res
        .status(200)
        .json(new ApiResponse(200, "review delete successfully"));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, error.message));
    }
  });

export { createReview,getReviewsByProductId ,getSinglereview,deletereview};
