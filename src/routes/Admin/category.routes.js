import { Router } from "express";
import {
    uploadcategory, getallcategory, deletecategory, getSinglecategory, updatecategorydetails, getallcategorytrue, updatestatus
} from "../../controllers/Admin/category_controller.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
// import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
const router = Router();

router.route("/uploadcategory").post(uploadToCloudinary("Image"), uploadcategory); 
router.route("/getallcategory").get(getallcategory); 
router.route("/deletecategory/:id").delete(deletecategory); 
router.route("/updatestatus/:id").patch(updatestatus); 
router.route("/getSinglecategory/:id").get(getSinglecategory); 
router.route("/getallcategorytrue/").get(getallcategorytrue); 
router.route("/updatecategorydetails/:id").put(uploadToCloudinary("Image") ,updatecategorydetails);
export default router;
