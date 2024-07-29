import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../models/Admin/Category_model.js";

const uploadcategory = asyncHandler(async (req, res) => {
  const { CategoryName, status } = req.body;
  try {
    if ([CategoryName].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "Category Name Required");
    }

    const Image = req.files["Image"] ? req.files["Image"][0].path : null;

    if (!Image) {
      throw new ApiError(400, "Image file is required");
    }
    const category = await Category.create({
      CategoryName: CategoryName.toLowerCase(),
      Image,
      status,
    });

    const createCategory = await Category.findById(category._id);

    if (!createCategory) {
      throw new ApiError(500, "Something went wrong while creating category");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(200, "category create Successfully", createCategory),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// get all category
const getallcategory = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      query,
      sortBy,
      sortType,
      categoryId,
    } = req.query;
    const filter = {};
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    const categorys = await Category.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ [sortBy]: sortType === "desc" ? -1 : 1 });
    if (!categorys || categorys.length === 0) {
      throw new ApiError(404, "No categorys found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "All categorys fetched successfully", categorys),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// get all categorytrue
const getallcategorytrue = asyncHandler(async (req, res) => {
  try {
    const categorys = await Category.find({ status: true });
    if (!categorys || categorys.length === 0) {
      throw new ApiError(404, "No categorys found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "All  categorys fetched successfully", categorys),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// getsingle category
const getSinglecategory = asyncHandler(async (req, res) => {
  try {
    const category_id = req.params.id;
    const category = await Category.findById(category_id).select("-__v");
    if (!category) {
      throw new ApiError(404, "category not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "category fetched successfully", category));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// update details
const updatecategorydetails = asyncHandler(async (req, res) => {
  try {
    const category_id = req.params.id;
    const { CategoryName } = req.body;

    if (!CategoryName) {
      throw new ApiError(400, "category is Required");
    }

    const imageurl = await Category.findById(category_id);
    const Image = req.files["Image"]
      ? req.files["Image"][0].path
      : imageurl.Image;

    const category = await Category.findByIdAndUpdate(
      category_id,
      {
        $set: {
          CategoryName,
          Image: Image,
        },
      },
      { new: true },
    ).select("-createdAt -updatedAt -__v");
    return res
      .status(200)
      .json(
        new ApiResponse(200, "category Details Update successfully", category),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// update status
const updatestatus = asyncHandler(async (req, res) => {
  const category_id = req.params.id;
  const { status } = req.body;
  try {
    if (status === undefined) {
      throw new ApiError(400, "Status is required");
    }
    if (typeof status !== "boolean") {
      throw new ApiError(400, "Status must be a boolean value");
    }

    // Update the category
    const category = await Category.findByIdAndUpdate(
      category_id,
      { $set: { status } },
      { new: true },
    ).select("status");

    if (!category) {
      throw new ApiError(404, "category not found");
    }

    // Return the updated category
    return res
      .status(200)
      .json(
        new ApiResponse(200, "category details updated successfully", category),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// delete category
const deletecategory = asyncHandler(async (req, res) => {
  try {
    const category_id = req.params.id;
    const category = await Category.findByIdAndDelete(category_id);

    if (!category) {
      throw new ApiError(404, "category not found to delete");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "category delete successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

export {
  uploadcategory,
  getallcategory,
  deletecategory,
  getSinglecategory,
  updatecategorydetails,
  getallcategorytrue,
  updatestatus,
};
