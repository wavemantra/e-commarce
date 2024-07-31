import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AdminNotification } from "../../models/web/Notification_model.js";
// get all adminnotification
const admingetalladminnotification = asyncHandler(async (_, res) => {
  try {
    const adminnotification = await AdminNotification.find();
    if (!adminnotification || adminnotification.length === 0) {
      throw new ApiError(404, "No notification found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "All  notification fetched successfully",
          adminnotification,
        ),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// get all adminnotification false
const admingetalladminnotificationflase = asyncHandler(async (_, res) => {
  try {
    const adminnotification = await AdminNotification.find({ status: false });
    if (!adminnotification || adminnotification.length === 0) {
      throw new ApiError(404, "No adminnotification found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "All  notification fetched successfully",
          adminnotification,
        ),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// get all adminnotification true
const admingetalladminnotificationtrue = asyncHandler(async (_, res) => {
  try {
    const adminnotification = await AdminNotification.find({ status: true });
    if (!adminnotification || adminnotification.length === 0) {
      throw new ApiError(404, "No notification found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "All  notification fetched successfully",
          adminnotification,
        ),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// update status
const adminupdateadminnotification = asyncHandler(async (req, res) => {
  const adminnotification_id = req.params.id;
  const { status } = req.body;

  try {
    if (status === undefined) {
      throw new ApiError(400, "Status is required");
    }
    if (typeof status !== "boolean") {
      throw new ApiError(400, "Status must be a boolean value");
    }
    // Update the adminnotification status
    const adminnotification = await AdminNotification.findByIdAndUpdate(
      adminnotification_id,
      { $set: { status } },
      { new: true },
    ).select("status");

    if (!adminnotification) {
      throw new ApiError(404, "notification not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "notification status updated successfully",
          adminnotification,
        ),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
//   delete adminnotification
const admindeleteadminnotification = asyncHandler(async (req, res) => {
  try {
    const adminnotification_id = req.params.id;
    const adminnotification =
      await AdminNotification.findByIdAndDelete(adminnotification_id);

    if (!adminnotification) {
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

export {
  admingetalladminnotification,
  admingetalladminnotificationflase,
  admingetalladminnotificationtrue,
  adminupdateadminnotification,
  admindeleteadminnotification,
};
