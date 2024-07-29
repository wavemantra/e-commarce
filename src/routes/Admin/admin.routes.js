import { Router } from "express";
import {
  adminregistration,
  loginAdmin,
  logoutadmin,
  refreshAccessToken,
  ChangeCurrentPassword,
  getCurrentadmin,
  updateAccountDetails,
  updateAvatar,
  deleteadmin,
} from "../../controllers/Admin/admin_controller.js";
import { uploadToCloudinary  } from "../../utils/cloudinary.js";
import { verifyJWT } from "../../middlewares/auth_middleware.js";
const router = Router();

router.route("/register").post(uploadToCloudinary ("avatar"), adminregistration); //check
router.route("/login").post(loginAdmin); //check
// // secured routes
router.route("/logout").post(verifyJWT, logoutadmin); //checked
router.route("/refreshToken").post(refreshAccessToken); //checked
router.route("/change-password").post(verifyJWT, ChangeCurrentPassword); //checked
router.route("/current-admin").get(verifyJWT, getCurrentadmin); //checked
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails); //checked
router.route("/delete-account").delete(verifyJWT, deleteadmin); //checked
// // images update
router.route("/avatar").patch(verifyJWT, uploadToCloudinary ("avatar"), updateAvatar); //checked
// total acount
// router.route("/totalcount").get(verifyJWT, totalcount)//checked
export default router;
