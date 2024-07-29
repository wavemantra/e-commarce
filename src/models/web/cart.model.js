import mongoose, { Schema } from "mongoose";

const cart = new Schema(
  {
    productCart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        totalPrice: {
          type: Number,
          default: 0,
          required: true,
        },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartTotal :{
      type : Number,
      default:0
    }
  },

  { timestamps: true },
);

export const Cart = mongoose.model("Cart", cart);
