import {  Router } from "express";
import * as controller from "../../controllers/client/courses.controller";
const router: Router = Router();
router.get("/",controller.index);
export const cartRoutes: Router = router;
