import mongoose, { Schema } from "mongoose";


const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        productPrice: {
            type: Number,
            required: true,
        },
        productQuantity: {
            type: Number
        }
    },
    {timestamps: true}
)

export const Product = mongoose.model("Product", productSchema)