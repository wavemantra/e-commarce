import mongoose, { Schema } from "mongoose";

const categoryName = new Schema(
  {
    CategoryName: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Category = mongoose.model("Category", categoryName);
