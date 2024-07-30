import { Router } from "express";
import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
import {
  createNotification,
  getallNotification,
  getallNotificationflase,
  getallNotificationtrue,
  updatenotification,
  deletenotification
} from "../../controllers/web/notification_controller.js";
const router = Router();

router.route("/createNotification").post(createNotification);
router.route("/getallNotification").get(verifyUserJWT, getallNotification);
router
  .route("/getallNotificationflase")
  .get(verifyUserJWT, getallNotificationflase);
router
  .route("/getallNotificationtrue")
  .get(verifyUserJWT, getallNotificationtrue);
router.route("/updatenotification/:id").patch(verifyUserJWT, updatenotification);
router.route("/deletenotification/:id").delete(verifyUserJWT, deletenotification);
export default router;
