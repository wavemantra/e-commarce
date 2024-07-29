import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Product } from "../../models/Admin/product_model.js";
import { Category } from "../../models/Admin/Category_model.js";
import mongoose from "mongoose";

const uploadproduct = asyncHandler(async (req, res) => {
  const { name, status, description, category, price, Mrp, SalePrice } = req.body;
  try {
    if ([name, category, price].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "name, category, and price are required");
    }

    // Check if the category ID is valid
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(400, "Invalid category ID");
    }

    const thumbnail = req.files["thumbnail"]
      ? req.files["thumbnail"][0].path
      : null;

    if (!thumbnail) {
      throw new ApiError(400, "thumbnail file is required");
    }

    const images = req.files["images"]
      ? req.files["images"].map((file) => file.path)
      : [];

    // Calculate profit and profit percentage
    const profit = SalePrice - price;
    const profitPercentage = (profit / price) * 100;

    const product = await Product.create({
      name: name.toLowerCase(),
      thumbnail,
      images,
      category,
      price,
      Mrp,
      SalePrice,
      profit,
      profitPercentage,
      description,
      status,
    });

    const createImage = await Product.findById(product._id).populate({
      path: "category",
      select: "CategoryName _id",
    });
    if (!createImage) {
      throw new ApiError(
        500, "Something went wrong while uploading the product",
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Product uploaded successfully", createImage));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});



// update details
const updateproductdetails = asyncHandler(async (req, res) => {
  const product_id = req.params.id;
  const { name,description, category,price } = req.body;

  // Validate input
  if (!(name || category)) {
    throw new ApiError(400, "Both title and category ID are required");
  }
  try {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(400, "Invalid category ID");
    }
    //   update product details
    const product = await Product.findByIdAndUpdate(
      product_id,
      {
        $set: {
          name,
          price,
          description,
          category,
        },
      },
      { new: true },
    ).select("-createdAt -updatedAt -__v");
    // Populate category information in the response
    const updatedproduct = await Product.findById(product._id).populate({
      path: "category",
      select: "CategoryName _id",
    });
    if (!updatedproduct) {
      throw new ApiError(500, "Failed to retrieve updated product details");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "product  updated successfully", updatedproduct),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// update status
const updateproductstatus = asyncHandler(async (req, res) => {
  const product_id = req.params.id;
  const { status } = req.body;
  try {
    if (status === undefined) {
      throw new ApiError(400, "Status is required");
    }
    if (typeof status !== "boolean") {
      throw new ApiError(400, "Status must be a boolean value");
    }

    // Update the product
    const product = await Product.findByIdAndUpdate(
      product_id,
      { $set: { status } },
      { new: true },
    ).select("status");

    if (!product) {
      throw new ApiError(404, "product not found");
    }

    // Return the updated product
    return res
      .status(200)
      .json(
        new ApiResponse(200, "product status updated successfully", product),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// get all product
const getallproduct = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, query, sortBy, sortType, adminId } = req.query;
  const filter = {};
  try {
    if (adminId) {
      filter.adminId = adminId;
    }
    const products = await Product.find(filter)
      .populate({
        path: "category",
        select: "CategoryName _id",
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ [sortBy]: sortType === "desc" ? -1 : 1 });

    if (!products || products.length === 0) {
      throw new ApiError(404, "No products found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "All uploaded products fetched successfully",
          products,
        ),
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// get all true product
const getallproducttrue = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ status: true });
    if (!products || products.length === 0) {
      throw new ApiError(404, "No product found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "All  products fetched successfully", products));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// get product by category
const getProductbyproduct = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  // Check if categoryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Invalid category ID format"));
  }
  try {
    // Check if the category ID exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      throw new ApiError(400, "Invalid category ID");
    }
    // Find all products with the specified category ID
    const products = await Product.find({ category: categoryId }).populate({
      path: "category",
      select: "CategoryName _id",
    });

    if (!products || products.length === 0) {
      throw new ApiError(404, "No products found for this category");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Products fetched successfully", products));
  } catch (error) {
    console.error("Error fetching products by category:", error.message);
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// get single product
const getSingleproduct = asyncHandler(async (req, res) => {
  const product_id = req.params.id;
  const product = await Product.findById(product_id);
  try {
    if (!product) {
      throw new ApiError(404, "product not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "product fetched successfully", product));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// delete product
const deleteproduct = asyncHandler(async (req, res) => {
  const product_id = req.params.id;
  const product = await Product.findByIdAndDelete(product_id);
  try {
    if (!product) {
      throw new ApiError(404, "product not found to delete");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "product delete successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

export {
  uploadproduct,
  getallproduct,
  deleteproduct,
  getSingleproduct,
  updateproductdetails,
  getProductbyproduct,
  updateproductstatus,
  getallproducttrue
};
