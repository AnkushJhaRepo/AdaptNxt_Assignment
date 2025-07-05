import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { verifyIfAdmin } from "../middlewares/role.middlewares.js";
import { 
    addProduct,
    updateProduct,
    deleteProduct, 
    getAllProducts
} from "../controllers/product.controllers.js";


const router =Router()


router.route("/").get(getAllProducts)


router.route("/add-product").post(verifyJWT, verifyIfAdmin, addProduct)
router.route("/update-product/:productId").patch(verifyJWT, verifyIfAdmin, updateProduct)
router.route("/delete-product/:productId").delete(verifyJWT, verifyIfAdmin, deleteProduct)


export default router