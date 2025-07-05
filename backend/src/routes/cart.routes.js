import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    addItemToCart,
    checkoutCart,
    deleteCartItem,
    getUserCart,
    updateCartItem
} from "../controllers/cart.controllers.js";


const router = Router()


router.route("/add-item/:productId").post(verifyJWT, addItemToCart)
router.route("/update-item/:productId").patch(verifyJWT, updateCartItem)
router.route("/delete-item/:productId").delete(verifyJWT, deleteCartItem)
router.route("/checkout").get(verifyJWT, checkoutCart)
router.route("/").get(verifyJWT, getUserCart)

export default router