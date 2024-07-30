import { Router } from "express";
import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
import {
  createReview,
  getReviewsByProductId,
  getSinglereview,
  deletereview,
} from "../../controllers/web/Product_Review_Controller.js";
const router = Router();

router.route("/create_review").post(verifyUserJWT, createReview);
router.route("/reviews/:productId").get(getReviewsByProductId);
router.route("/singlereviews/:id").get(getSinglereview);
router.route("/deletereview/:id").delete(verifyUserJWT, deletereview);
export default router;
