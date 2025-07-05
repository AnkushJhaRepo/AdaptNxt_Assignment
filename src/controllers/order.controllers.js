import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Order } from "../models/order.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose"


const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "completed", "cancelled"];

    if (!isValidObjectId(orderId)) {
        throw new ApiError(400, "Invalid Order ID");
    }

    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Allowed: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.status = status;
    await order.save();

    res.status(200).json(new ApiResponse(
        200,
        order,
        `Order status updated to ${status}`
    )
    );
});


export {
    updateOrderStatus
}