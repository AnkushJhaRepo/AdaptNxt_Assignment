import mongoose,{Schema} from "mongoose";
import { type } from "os";

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true
        },
        items: [
            {
                product: {
                    type:Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1,
                }
            }
        ],
        totalAmount: {
            type: Number,
            default: 0
        }
    }, {timestamps: true}
)

export const Cart = mongoose.model("Cart", cartSchema)
