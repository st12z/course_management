import {  Router } from "express";
import * as controller from "../../controllers/client/vourcher.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router: Router = Router();
router.get("/",controller.index);
router.post("/save",authMiddleware,controller.saveVourcher);
router.get("/:userId",authMiddleware,controller.vourcherOfUser);
router.post("/use",authMiddleware,controller.useVourcher);
router.post("/delete",authMiddleware,controller.deleteVourcher);
export const vourcherRoutes: Router = router;