import { Router } from "express";
import { addtocart,getallcartProduct,deletecartproduct,increasequantiy,decreasequantiy ,updatesize,deletecart} from "../../controllers/web/cart_controller.js";
import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
const router = Router();

router.route("/addtocart").post(verifyUserJWT,addtocart); 
router.route("/getallcartProduct").get(verifyUserJWT,getallcartProduct); 
router.route("/deletecart/:id").delete(verifyUserJWT,deletecart); 
router.route("/deletecartproduct/:cartId/:proId").delete(verifyUserJWT,deletecartproduct); 
router.route("/increasequantiy/:cartId/:proId").patch(verifyUserJWT,increasequantiy); 
router.route("/decreasequantiy/:cartId/:proId").patch(verifyUserJWT,decreasequantiy); 
router.route("/updatesize/:cartId/:proId").patch(verifyUserJWT,updatesize); 

export default router;
