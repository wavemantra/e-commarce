import { Router } from "express";
import {
    uploadproduct, getallproduct, deleteproduct, getSingleproduct, updateproductdetails, getProductbyproduct,updateproductstatus,getallproducttrue
} from "../../controllers/Admin/product_controller.js";
import { uploadTo } from "../../utils/cloudinary.js";
// import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
const router = Router();

router.route("/uploadproduct").post(uploadTo("thumbnail", ["images"]), uploadproduct);
router.route("/getallproduct").get(getallproduct); 
router.route("/deleteproduct/:id").delete(deleteproduct); 
router.route("/updateproductstatus/:id").patch(updateproductstatus); 
router.route("/getSingleproduct/:id").get(getSingleproduct); 
router.route("/getallproducts").get(getallproducttrue); 
router.route("/updateproductdetails/:id").put(updateproductdetails);
router.route("/getProductbyproduct/:categoryId").get(getProductbyproduct);
export default router;
