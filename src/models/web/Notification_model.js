import mongoose, { Schema } from "mongoose";

const notification = new Schema(
  {
    Description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
export const Notification = mongoose.model("Notification", notification);

const adminnotification = new Schema(
  {
    Description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const AdminNotification = mongoose.model(
  "AdminNotification",
  adminnotification,
);
