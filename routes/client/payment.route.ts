import {  Router } from "express";
import * as controller from "../../controllers/client/payment.controller";
const router: Router = Router();
router.get("/check-out",controller.checkOut);
router.post("/processing",controller.processing);
router.post("/callback",controller.callBack);
router.get("/order-status/:apptransId",controller.order);
export const paymentRoutes: Router = router;
