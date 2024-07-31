import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Notification } from "../../models/web/Notification_model.js";

// create notification
const createNotification = asyncHandler(async (req, res) => {
    try {
      const { Description,status } = req.body;
      if ([Description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Description is required");
      }
      const notification = await Notification.create({ Description ,status});  
      const createdNotification = await Notification.findById(notification._id);
      if (!createdNotification) {
        throw new ApiError(500, "Something went wrong while creating Notification");
      }
      return res
        .status(201)
        .json(new ApiResponse(200, "Notification sent successfully", createdNotification));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, error.message));
    }
  });
  
// get all notification 
const getallNotification =  asyncHandler(async(_,res)=>{
    try {
        const notification = await Notification.find();
        if (!notification || notification.length === 0) {
          throw new ApiError(404, "No notification found");
        }
        return res
          .status(200)
          .json(
            new ApiResponse(200, "All  notification fetched successfully", notification),
          );
      } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json(new ApiResponse(error.statusCode || 500, error.message));
      }
}) 
// get all notification false
const getallNotificationflase =  asyncHandler(async(_,res)=>{
    try {
        const notification = await Notification.find({ status: false });
        if (!notification || notification.length === 0) {
          throw new ApiError(404, "No notification found");
        }
        return res
          .status(200)
          .json(
            new ApiResponse(200, "All  notification fetched successfully", notification),
          );
      } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json(new ApiResponse(error.statusCode || 500, error.message));
      }
}) 
// get all notification true
const getallNotificationtrue=  asyncHandler(async(_,res)=>{
    try {
        const notification = await Notification.find({ status: true });
        if (!notification || notification.length === 0) {
          throw new ApiError(404, "No notification found");
        }
        return res
          .status(200)
          .json(
            new ApiResponse(200, "All  notification fetched successfully", notification),
          );
      } catch (error) {
        return res
          .status(error.statusCode || 500)
          .json(new ApiResponse(error.statusCode || 500, error.message));
      }
}) 
// update status
const updatenotification = asyncHandler(async (req, res) => {
    const notification_id = req.params.id;
    const { status } = req.body;
  
    try {
      if (status === undefined) {
        throw new ApiError(400, "Status is required");
      }
      if (typeof status !== "boolean") {
        throw new ApiError(400, "Status must be a boolean value");
      }
      // Update the notification status
      const notification = await Notification.findByIdAndUpdate(
        notification_id,
        { $set: { status } },
        { new: true },
      ).select("status");
  
      if (!notification) {
        throw new ApiError(404, "notification not found");
      }
  
      return res
        .status(200)
        .json(
          new ApiResponse(200, "notification details updated successfully", notification),
        );
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, error.message));
    }
  });
//   delete notification
  const deletenotification = asyncHandler(async (req, res) => {
    try {
      const notification_id = req.params.id;
      const notification = await Notification.findByIdAndDelete(notification_id);
  
      if (!notification) {
        throw new ApiError(404, "notification not found to delete");
      }
      return res
        .status(200)
        .json(new ApiResponse(200, "notification delete successfully"));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, error.message));
    }
  });
  
export { createNotification,getallNotification,getallNotificationflase,getallNotificationtrue,updatenotification,deletenotification};
