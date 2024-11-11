import {  Router } from "express";
import * as controller from "../../controllers/client/track-order.controller";
const router: Router = Router();
router.get("/",controller.index);
router.get("/result",controller.result);
export const trackOrderRoutes: Router = router;
