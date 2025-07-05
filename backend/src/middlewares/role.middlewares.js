import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyIfAdmin = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user?.isAdmin) {
            throw new ApiError(
                403,
                "You are not admin"
            )
        }
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Something went wrong")
    }
})