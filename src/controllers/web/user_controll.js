import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import { User } from "../../models/web/user_model.js";
import { AdminNotification } from "../../models/web/Notification_model.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token",
    );
  }
};

const userregistration = asyncHandler(async (req, res) => {
  const { email, Name, password, phone, status } = req.body;
  try {
    if ([email, Name, password, phone].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
    const existeduser = await User.findOne({
      $or: [{ phone }, { email }],
    });
    if (existeduser) {
      throw new ApiError(409, "user with email or username already exists");
    }
    // const avatar = req.files["avatar"]
    //     ? req.files["avatar"][0].path
    //     : null;

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required")
    // }
    const user = await User.create({
      Name: Name.toLowerCase(),
      email,
      phone,
      password,
    });

    const createduser = await User.findById(user._id).select(
      "-password -refreshToken -watchHistoy",
    );
    if (!createduser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user",
      );
    }

    const adminNotification = await AdminNotification.create({
      Description: `${user.Name}! New user Registered`,
    });

    if (!adminNotification) {
      throw new ApiError(
        500,
        "Something went wrong while creating notification",
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, "user registered Successfully", createduser));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// login user
const loginuser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  try {
    if (!phone && !email) {
      throw new ApiError(400, "userName or email is required");
    }

    const user = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "password is wrong");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id,
    );

    // Update the user status to true
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { status: true } },
      { new: true },
    ).select("-password -refreshToken");

    if (!updatedUser) {
      throw new ApiError(404, "user not found");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "user logged In Successfully", {
          accessToken,
          refreshToken,
        }),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// // logout user
const logoutuser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );
  // Update the user status to true
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { status: false } },
    { new: true },
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "user not found");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user logged Out Succssfully"));
});
// // refreshToken
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized accessToken");
  }
  try {
    const decodedToken = Jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "invaild refreshToken");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired || used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { NewaccessToken, NewrefreshToken } =
      await generateAccessAndRefereshTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", NewaccessToken, options)
      .cookie("refreshToken", NewrefreshToken, options)
      .json(new ApiResponse(200, "Access Token Refresh successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// // changecurrent password
const ChangeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "invaild Password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, "password update successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// // get corrent user
const getCurrentuser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched succufully!!"));
});
// get alluser
const getalluser = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, sortBy, sortType, userId } = req.query;
  const filter = {};
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }
  if (userId) {
    filter.userId = userId;
  }
  try {
    const users = await User.find(filter)
      .select("-__v -refreshToken -password")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ [sortBy]: sortType === "desc" ? -1 : 1 });

    if (!users || users.length === 0) {
      throw new ApiError(404, "No users found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "All users fetched successfully", users));
  } catch (error) {
    // Handle any errors
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// update
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { Name, email } = req.body;
  if (!(Name || email)) {
    throw new ApiError(400, "All Fileds are Required");
  }

  const user = await user
    .findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          Name,
          email,
        },
      },
      { new: true },
    )
    .select("-password -watchHistoy -createdAt -updatedAt");
  return res
    .status(200)
    .json(new ApiResponse(200, "Account Details Update successfully", user));
});

const deleteuser = asyncHandler(async (req, res) => {
  const user_id = req.params.id;
  // const {user} = req.body;
  const deleteduser = await User.findByIdAndDelete(user_id);
  try {
    if (!deleteduser) {
      throw new ApiError(404, "user not found");
    }
    const adminNotification = await AdminNotification.create({
      Description: `${deleteduser.Name}! Delete the account`,
    });

    if (!adminNotification) {
      throw new ApiError(
        500,
        "Something went wrong while creating notification",
      );
    }
    // Respond with success message
    return res
      .status(200)
      .json(new ApiResponse(200, "user deleted successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// // update avartar
const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const avatar = req.files["avatar"] ? req.files["avatar"][0].path : null;
    if (!avatar) {
      throw new ApiError(400, "Avatar file is missing");
    }
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          avatar: avatar,
        },
      },
      { new: true },
    );
    return res
      .status(200)
      .json(new ApiResponse(200, "user avatar update succssfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

export {
  userregistration,
  loginuser,
  logoutuser,
  refreshAccessToken,
  ChangeCurrentPassword,
  getCurrentuser,
  updateAccountDetails,
  updateAvatar,
  deleteuser,
  getalluser,
  //  totalcount
};
