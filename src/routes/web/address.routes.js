import { Router } from "express";
import {
    uploadaddress, getalladdress, deleteaddress, getSingleaddress, updateaddressdetails, getalladdresstrue, updatestatus
} from "../../controllers/web/address_controller.js";
// import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
const router = Router();

router.route("/uploadaddress").post(uploadaddress); 
router.route("/getalladdress").get(getalladdress); 
router.route("/deleteaddress/:id").delete(deleteaddress); 
router.route("/updatestatus/:id").patch(updatestatus); 
router.route("/getSingleaddress/:id").get(getSingleaddress); 
router.route("/getalladdresstrue/").get(getalladdresstrue); 
router.route("/updateaddressdetails/:id").put(updateaddressdetails);
export default router;
