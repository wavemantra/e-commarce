import { Router } from "express";
import {
    uploadfeedback,
    getallfeedback,
    deletefeedback,
    getSinglefeedback,
    updatestatus,
} from "../../controllers/Admin/feedback_controller.js";
import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
const router = Router();

router.route("/uploadfeedback").post(verifyUserJWT, uploadfeedback);
router.route("/getallfeedback").get(getallfeedback);
router.route("/updatefeedbackstatus/:id").patch(updatestatus);
router.route("/getSinglefeedback/:id").get(getSinglefeedback);
router.route("/deletefeedback/:id").delete(deletefeedback);

export default router;
