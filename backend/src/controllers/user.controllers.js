import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(400, "User doesn't exist")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Access Token refreshed successfully"
                )
            )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while refreshing accesss token")
    }
})


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullname, password, isAdmin, isCustomer } = req.body

    if (
        [username, email, password, fullname].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exist")
    }

    try {

        const user = await User.create({
            username,
            email,
            password,
            isAdmin,
            isCustomer,
            fullname
        })

        const createdUser = await User.findById(user._id)

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering a user")
        }

        return res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"))

    } catch (error) {
        console.log("User creation failed", error.message, error);

        throw new ApiError(500, "Something went wrong while registering a user")

    }

})


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (
        [email, password].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400, "Please fill all details")
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "No such user exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Wrong password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
        ))

})


const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(
            200,
            {},
            "User logged out successfully"
        ))
})


const currentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(
        200,
        req.user,
        "Current user details"
    ))
})


export {
    refreshAccessToken,
    registerUser,
    login,
    logout,
    currentUser
}
