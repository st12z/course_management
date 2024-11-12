import {  Router } from "express";
import * as controller from "../../controllers/client/vourcher.controller";
const router: Router = Router();
router.get("/",controller.index);
router.post("/save",controller.save);
export const vourcherRoutes: Router = router;
