import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { registerUser, 
    refreshAccessToken, 
    login,
    logout,
    currentUser
} from "../controllers/user.controllers.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(login)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(verifyJWT, logout)
router.route("/current-user").get(verifyJWT, currentUser)

export default router