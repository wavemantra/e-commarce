import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Cart } from "../../models/web/cart.model.js";
import { User } from "../../models/web/user_model.js";
import { Order } from '../../models/web/order_model.js'

// create order
const createOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }
    const cart = await Cart.findOne({ user: userId })
      .lean()
      .populate("productCart.product");

    if (!cart || !cart.productCart || cart.productCart.length === 0) {
      res.status(404);
      throw new Error("Cart is empty!");
    }
    const cartProducts = cart.productCart.map((item) => ({
      product: item.product._id,
      count: item.quantity || 1,
    }));
    const order = await Order.create({
      productCart: cartProducts,
      orderby: userId,
      totalPrice: cart.cartTotal,
    });
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// get all order from user
const getallorder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const orderItems = await Order.find({ orderby: userId })
      .populate("productCart.product")
      .exec();
    return res.status(200).json(new ApiResponse(200, "All orders fetched successfully", orderItems));
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// getallorder
const getAllOrdersForAdmin = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i'); 
      query.$or = [
        { "productCart.product.name": searchRegex },
        { "orderby.name": searchRegex },
        { "orderby.phone": searchRegex }
      ];
    }
    const orders = await Order.find(query)
      .populate("productCart.product")
      .populate("orderby", "name email phone") 
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();
    // Get total count for pagination
    const totalCount = await Order.countDocuments(query);
    return res.status(200).json(new ApiResponse(200, "Orders fetched successfully", {
      orders,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      totalCount,
    }));
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Validate input
  if (!status || !["pending", "dispatched", "delivered", "cancelled"].includes(status)) {
    return res.status(400).json(new ApiResponse(400, "Invalid status value"));
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, "Order not found"));
    }

    order.orderStatus = status;
    await order.save();

    return res.status(200).json(new ApiResponse(200, "Order status updated successfully", order));
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json(new ApiResponse(500, error.message));
  }
});

// delete product
const deleteorderproduct = asyncHandler(async (req, res) => {
  const cartproduct_id = req.params.id;
  const product = await Order.findByIdAndDelete(cartproduct_id);
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
export { createOrder, deleteorderproduct, getallorder,getAllOrdersForAdmin,updateOrderStatus };
