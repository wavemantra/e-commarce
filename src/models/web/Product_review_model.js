import mongoose, { Schema } from "mongoose";
const productReview = new Schema(
  {
    productId: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const ProductReview = mongoose.model("ProductReview", productReview);
