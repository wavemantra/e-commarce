import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Cart } from "../../models/web/cart.model.js";
import { Product } from "../../models/Admin/product_model.js";

const addtocart = asyncHandler(async (req, res) => {
  try {
    const { product, quantity = 1, size } = req.body;
    const userID = req.user._id;
    if (!size) {
      throw new ApiError(400, "Please Select Size");
    }
    // Check if product and user fields are provided
    if (!product) {
      throw new ApiError(400, "Product is required");
    }
    if (!userID) {
      throw new ApiError(400, "User is required");
    }
    // Check if the product exists
    const productExist = await Product.findById(product).exec();
    if (!productExist) {
      throw new ApiError(400, "Product not found");
    }

    // Calculate the total price for the product
    const totalPrice = productExist.price * quantity;
    // Populate the product details in the created cart item
    // const cartItems = await Cart.find({ user: userID })
    //   .populate("productCart.product")
    //   .exec();

    const cartAvaible = await Cart.findOne({ user: userID });

    console.log(cartAvaible);

    // Create the cart item
    // const findUser = await User.findById(userID);
    if (cartAvaible) {
      // Check if the product already exists in the user's cart
      const productInCart = await Cart.findOne({
        user: userID,
        "productCart.product": product,
      }).exec();

      if (productInCart) {
        throw new ApiError(409, "This product is already in the cart");
      } else {
        const overallTotalPrice = cartAvaible.cartTotal + totalPrice;

        cartAvaible.cartTotal = overallTotalPrice;
        cartAvaible.productCart.push({
          product: product,
          quantity: quantity,
          size: size,
          totalPrice: totalPrice,
        });
        const cart = await cartAvaible.save();

        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              "Product added successfully",
              cart,
            ),
          );
      }
    } else {
      const cart = await Cart.create({
        productCart: {
          product: product,
          quantity: quantity,
          size: size,
          totalPrice: totalPrice,
        },
        user: userID,
        cartTotal: totalPrice,
      });

      if (!cart) {
        throw new ApiError(
          400,
          "Something went wrong while adding product to cart",
        );
      }
      return res.status(200).json(
        new ApiResponse(200, "Product added successfully", {
          cart,
          totalPrice,
        }),
      );
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// get all cart
const getallcartProduct = asyncHandler(async (req, res) => {
  try {
    const userID = req.user._id;
    // Fetch all cart items for the user
    const cartItems = await Cart.find({ user: userID })
      .populate("productCart.product")
      .exec();
    return res.status(200).json(
      new ApiResponse(200, "All carts fetched successfully", {
        cartItems,
      }),
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// increase quantiy
const increasequantiy = asyncHandler(async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.params.proId;

  try {
    // Fetch the cart item by ID
    const cart = await Cart.findOne({ _id: cartId })
      .populate("productCart.product")
      .exec();

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Find the product in the cart
    const productInCart = cart.productCart.find(
      (item) => item.product._id.toString() === productId,
    );

    if (!productInCart) {
      throw new ApiError(404, "Product not found in cart");
    }

    // Increase the quantity by 1
    productInCart.quantity += 1;

    // Recalculate the total price for the product and cart
    productInCart.totalPrice =
      productInCart.quantity * productInCart.product.price;
    cart.cartTotal = cart.productCart.reduce(
      (total, item) => total + item.totalPrice,
      0,
    );

    // Save the updated cart
    const updatedCart = await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Quantity updated successfully", updatedCart));
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// decrease quantiy
const decreasequantiy = asyncHandler(async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.params.proId;

  try {
    // Fetch the cart item by ID
    const cart = await Cart.findOne({ _id: cartId })
      .populate("productCart.product")
      .exec();

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Find the product in the cart
    const productInCart = cart.productCart.find(
      (item) => item.product._id.toString() === productId,
    );

    if (!productInCart) {
      throw new ApiError(404, "Product not found in cart");
    }

    // Increase the quantity by 1
    productInCart.quantity -= 1;

    // Recalculate the total price for the product and cart
    productInCart.totalPrice =
      productInCart.quantity * productInCart.product.price;
    cart.cartTotal = cart.productCart.reduce(
      (total, item) => total + item.totalPrice,
      0,
    );

    // Save the updated cart
    const updatedCart = await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Quantity updated successfully", updatedCart));
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});
// updatesize
const updatesize = asyncHandler(async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.proId;
    const { size } = req.body;

    if (!size) {
      throw new ApiError(400, "Please select size");
    }

    const cart = await Cart.findOne({ _id: cartId })
      .populate("productCart.product")
      .exec();

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Find the product in the cart
    const productInCart = cart.productCart.find(
      (item) => item.product._id.toString() === productId,
    );

    if (!productInCart) {
      throw new ApiError(404, "Product not found in cart");
    }

    // Update the size of the product
    productInCart.size = size;

    // Save the updated cart
    const updatedCart = await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Size updated successfully", updatedCart));
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

// delete product
const deletecart = asyncHandler(async (req, res) => {
  const cartproduct_id = req.params.id;
  const product = await Cart.findByIdAndDelete(cartproduct_id);
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

const deletecartproduct = asyncHandler(async (req, res) => {
  const cartId = req.params.cartId; // Assuming the cart ID is passed as a parameter
  const productId = req.params.proId; // Assuming the product ID is passed as a parameter

  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Find the index of the product in the cart's productCart array
    const productIndex = cart.productCart.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex === -1) {
      throw new ApiError(404, "Product not found in cart");
    }

    // Get the total price of the product to be removed
    const productTotalPrice = cart.productCart[productIndex].totalPrice;

    // Remove the product from the cart
    cart.productCart.splice(productIndex, 1);

    // Update the cart total
    cart.cartTotal -= productTotalPrice;

    // Save the updated cart
    await cart.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Product deleted successfully", cart));
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, error.message));
  }
});

export {
  addtocart,
  getallcartProduct,
  deletecartproduct,
  increasequantiy,
  decreasequantiy,
  updatesize,
  deletecart,
};
