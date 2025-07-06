import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/product.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const addProduct = asyncHandler(async (req, res) => {
    const { productName, productPrice, productQuantity } = req.body

    if (productName.trim() === "") {
        throw new ApiError(400, "please give product name")
    }

    if (
        [productPrice, productQuantity].some((field) => field === "")
    ) {
        throw new ApiError(400, "Please give all input")
    }

    try {
        const newProduct = await Product.create({
            productName,
            productPrice,
            productQuantity
        })

        const addedProduct = await Product.findById(newProduct._id)

        if (!addedProduct) {
            throw new ApiError(500, "Something went wrong creating product")
        }

        return res.status(201).json(new ApiResponse(
            200,
            addedProduct,
            "Product added"
        ))

    } catch (error) {
        console.log("Error adding Product", error.message, error);
        throw new ApiError(500, "Error adding product")
    }

})


const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params

    const { productPrice, productQuantity } = req.body

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Please give valid product Id")
    }

    const product = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                productPrice: productPrice,
                productQuantity: productQuantity
            }
        },
        { new: true }
    )

    res.status(200).json(new ApiResponse(
        200,
        product,
        "Updated product"
    ))

})


const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Enter valid product Id")
    }

    const product = await Product.findByIdAndDelete(productId)

    if (!product) {
        throw new ApiError(404, "No such product found")
    }


    res.status(200).json(new ApiResponse(
        200,
        {},
        "Product Deleted"
    ))


})


const getAllProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {
        productQuantity: { $gt: 0 },
        productName: { $regex: search, $options: "i" }
    };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).skip(skip).limit(limit);

    res.status(200).json({
        success: true,
        data: products,
        page,
        totalPages: Math.ceil(total / limit)
    });
});


export {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts
}