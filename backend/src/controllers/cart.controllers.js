import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Cart } from "../models/cart.models.js"
import { Product } from "../models/product.models.js"
import { Order } from "../models/order.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const getUserCart = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!userId) {
        throw new ApiError("Please do login")
    }

    const cart = await Cart.findOne({
        user: userId
    })
        .populate("user", "username")
        .populate("items.product", "productName productPrice")

    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }

    return res.status(200).json(new ApiResponse(
        200,
        cart,
        "Users cart"
    ))

})


const addItemToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { quantity } = req.body

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Enter correct Product id")
    }

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    if (product.productQuantity < quantity) {
        throw new ApiError(400, "Insuficent stock ")
    }

    let cart = await Cart.findOne({
        user: req.user._id
    })


    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [{ product: productId, quantity }],
            totalAmount: product.productPrice * quantity
        })
    } else {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        cart.totalAmount = 0;
        for (let item of cart.items) {
            const prod = await Product.findById(item.product);
            cart.totalAmount += prod.productPrice * item.quantity;
        }

        await cart.save();

    }




    cart = await Cart.findById(cart._id)
        .populate("user", "username")
        .populate("items.product", "productName productPrice")

    res.status(200).json(new ApiResponse(200, cart, "Product added to cart"));


})


const updateCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { quantity } = req.body

    const userId = req.user._id

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Please enter valid product Id")
    }

    if (quantity < 1) {
        throw new ApiError(400, "Please Enter valid quantity")
    }

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(404, "No product found")
    }

    if (product.productQuantity < quantity) {
        throw new ApiError(400, "Insuficent Stock")
    }

    const cart = await Cart.findOne({
        user: userId
    })
        .populate("user", "username")
    if (!cart) {
        throw new ApiError(404, "No cart found")
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)

    if (itemIndex === -1) {
        throw new ApiError(404, "Product not found in cart")
    }

    cart.items[itemIndex].quantity = quantity;

    cart.totalAmount = 0;
    for (let item of cart.items) {
        const prod = await Product.findById(item.product);
        cart.totalAmount += prod.productPrice * item.quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
        .populate("user", "username")
        .populate("items.product", "productName productPrice");

    res.status(200).json(new ApiResponse(
        200,
        updatedCart,
        "Item updated"
    ));


})


const deleteCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params

    const userId = req.user._id

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Enter a correct Product Id")
    }

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    const cart = await Cart.findOne({
        user: userId
    })
    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)

    if (itemIndex === -1) {
        throw new ApiError(404, "Product not found in cart")
    }

    cart.items.splice(itemIndex, 1)

    cart.totalAmount = 0;
    for (let item of cart.items) {
        const prod = await Product.findById(item.product);
        cart.totalAmount += prod.productPrice * item.quantity;
    }

    await cart.save()

    const updatedCart = await Cart.findById(cart._id)
        .populate("user", "username")
        .populate("items.product", "productName productPrice");

    res.status(200).json(new ApiResponse(
        200,
        updatedCart,
        "Item deleted from cart"
    ))


})


const checkoutCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
        .populate("items.product", "productName productPrice productQuantity");
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty");
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
        const product = await Product.findById(item.product._id);

        product.productQuantity -= item.quantity;
        await product.save();

        const itemTotal = product.productPrice * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.productPrice
        });
    }

    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount
    });

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json(new ApiResponse(
        200,
        order,
        "Order placed successfully"
    )
    );
});


export {
    addItemToCart,
    updateCartItem,
    deleteCartItem,
    checkoutCart,
    getUserCart
}
