import {  Router } from "express";
import * as controller from "../../controllers/client/try-learn.controller";
const router: Router = Router();

router.get("/:slugCourse", controller.index);
export const tryLearningRoutes: Router = router;
