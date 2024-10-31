import {  Router } from "express";
import * as controller from "../../controllers/client/favorite-courses.controller";
const router: Router = Router();
router.get("/",controller.index);
export const favoriteCoursesRoutes: Router = router;
