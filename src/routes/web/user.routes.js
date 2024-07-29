import { Router } from "express";
import {
  userregistration,
  loginuser,
  logoutuser,
  refreshAccessToken,
  ChangeCurrentPassword,
  getCurrentuser,
  updateAccountDetails,
  updateAvatar,
  deleteuser,
  getalluser
} from "../../controllers/web/user_controll.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
const router = Router();

router.route("/register").post(uploadToCloudinary("avatar"), userregistration); 
router.route("/login").post(loginuser); //check
// secured routes
router.route("/logout").post(verifyUserJWT, logoutuser); 
router.route("/refreshToken").post(refreshAccessToken); 
router.route("/change-password").post(verifyUserJWT, ChangeCurrentPassword); 
router.route("/current-user").get(verifyUserJWT, getCurrentuser); 
router.route("/update-account-details").patch(verifyUserJWT, updateAccountDetails); 
//images update
router.route("/avatar").patch(verifyUserJWT, uploadToCloudinary("avatar"), updateAvatar); 
// delete account
router.route("/delete_account/:id").delete(verifyUserJWT, deleteuser); 

// total acount
// router.route("/totalcount").get(verifyJWT, totalcount)

// admin apis
router.route("/getalluser").get(getalluser); 
router.route("/delete_user/:id").delete(deleteuser); 
export default router;
