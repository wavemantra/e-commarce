import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Address } from "../../models/web/address_model.js";

const uploadaddress = asyncHandler(async (req, res) => {
  const { address, street, city, state, zip, status } = req.body;
  try {
    if (
      [address, street, city, state, zip].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "all fileds are Required");
    }
    // create data
    const Addaddress = await Address.create({
      address,
      street,
      city,
      state,
      zip,
      status,
    });

    const createaddress = await Address.findById(Addaddress._id);
    if (!createaddress) {
      throw new ApiError(500, "Something went wrong while creating address");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, "address create Successfully", createaddress));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// update details
const updateaddressdetails = asyncHandler(async (req, res) => {
  try {
    const address_id = req.params.id;
    const { address, street, city, state, zip } = req.body;

    if (!(address || street || city || state || zip)) {
      throw new ApiError(400, "address is Required");
    }

    const updateaddress = await Address.findByIdAndUpdate(
      address_id,
      {
        $set: {
          address,
          street,
          city,
          state,
          zip,
        },
      },
      { new: true },
    ).select("-createdAt -updatedAt -__v");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "address Details Update successfully",
          updateaddress,
        ),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// get all address
const getalladdress = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      query,
      sortBy,
      sortType,
      addressId,
    } = req.query;
    const filter = {};
    if (addressId) {
      filter.addressId = addressId;
    }
    const addresss = await Address.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ [sortBy]: sortType === "desc" ? -1 : 1 });
    if (!addresss || addresss.length === 0) {
      throw new ApiError(404, "No addresss found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "All addresss fetched successfully", addresss),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// get all addresstrue
const getalladdresstrue = asyncHandler(async (req, res) => {
  try {
    const addresss = await Address.find({ status: true });
    if (!addresss || addresss.length === 0) {
      throw new ApiError(404, "No addresss found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "All  addresss fetched successfully", addresss),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// getsingle address
const getSingleaddress = asyncHandler(async (req, res) => {
  try {
    const address_id = req.params.id;
    const address = await Address.findById(address_id).select("-__v");
    if (!address) {
      throw new ApiError(404, "address not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "address fetched successfully", address));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// update status
const updatestatus = asyncHandler(async (req, res) => {
  const address_id = req.params.id;
  const { status } = req.body;

  try {
    if (status === undefined) {
      throw new ApiError(400, "Status is required");
    }
    if (typeof status !== "boolean") {
      throw new ApiError(400, "Status must be a boolean value");
    }

    // If status is true, set all other addresses' status to false
    if (status === true) {
      await Address.updateMany({}, { $set: { status: false } });
    }

    // Update the address status
    const address = await Address.findByIdAndUpdate(
      address_id,
      { $set: { status } },
      { new: true },
    ).select("status");

    if (!address) {
      throw new ApiError(404, "address not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "address details updated successfully", address),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// delete address
const deleteaddress = asyncHandler(async (req, res) => {
  try {
    const address_id = req.params.id;
    const address = await Address.findByIdAndDelete(address_id);

    if (!address) {
      throw new ApiError(404, "address not found to delete");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "address delete successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

export {
  uploadaddress,
  getalladdress,
  deleteaddress,
  getSingleaddress,
  updateaddressdetails,
  getalladdresstrue,
  updatestatus,
};
