import { Router } from "express";
import { verifyIfAdmin } from "../middlewares/role.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { updateOrderStatus } from "../controllers/order.controllers.js";


const router = Router()


router.route("/update-status/:orderId").patch(verifyJWT, verifyIfAdmin, updateOrderStatus)


export default router