import { Router } from "express";
import { createOrder ,getallorder,deleteorderproduct,getAllOrdersForAdmin,updateOrderStatus} from "../../controllers/web/order_controller.js";
import { verifyUserJWT } from "../../middlewares/auth_middleware.js";
const router = Router();

router.route("/createOrder").post(verifyUserJWT, createOrder);
router.route("/getallorder").get(verifyUserJWT,getallorder);
router.route("/getAllOrdersForAdmin").get(getAllOrdersForAdmin);
router.route("/deleteorderproduct/:id").delete(verifyUserJWT,deleteorderproduct);
router.route("/updateOrderStatus/:orderId").patch(verifyUserJWT,updateOrderStatus);


export default router;
