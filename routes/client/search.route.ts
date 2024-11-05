import {  Router } from "express";
import * as controller from "../../controllers/client/search.controller";
const router: Router = Router();

router.get("/:type", controller.index);
export const searchRoutes: Router = router;
