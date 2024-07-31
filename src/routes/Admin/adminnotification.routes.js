import { Router } from "express";
// import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
import {
  admingetalladminnotification,
  admingetalladminnotificationflase,
  admingetalladminnotificationtrue,
  adminupdateadminnotification,
  admindeleteadminnotification,
} from "../../controllers/Admin/AdminNotification_controller.js";
const router = Router();
router.route("/admin_getallNotification").get(admingetalladminnotification);
router.route("/admin_getallNotificationflase").get(admingetalladminnotificationflase);
router.route("/admin_getallNotificationtrue").get(admingetalladminnotificationtrue);
router.route("/admin_updatenotification/:id").patch(adminupdateadminnotification);
router.route("/admin_deletenotification/:id").delete(admindeleteadminnotification);
export default router;
