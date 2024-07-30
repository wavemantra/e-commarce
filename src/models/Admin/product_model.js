import mongoose, { Schema } from "mongoose";

const product = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    Mrp: {
      type: Number,
    },
    price: {
      type: Number,
    },
    SalePrice: {
      type: Number,
    },
    profit: {
      type: Number,
    },
    profitPercentage: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: "ProductReview",
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", product);
