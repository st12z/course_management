import {  Router } from "express";
import * as controller from "../../controllers/client/courses.controller";
const router: Router = Router();

router.get("/:slugTopic", controller.index);
router.get("/detail/:slugCourse", controller.detail);
export const courseRoutes: Router = router;
