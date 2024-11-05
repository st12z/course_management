import {  Router } from "express";
import * as controller from "../../controllers/client/courses.controller";
const router: Router = Router();
router.get("/:slugTopic", controller.index);
router.get("/detail/:slugCourse", controller.detail);
router.post("/like/:slugCourse",controller.like);
router.post("/unlike/:slugCourse",controller.unlike);
router.post("/tym/:slugCourse",controller.tym);
router.post("/untym/:slugCourse",controller.untym);
router.post("/feedback/:slugCourse",controller.feedBackPost);
router.post("/feedback/like/:id",controller.likeFeed);
router.post("/feedback/unlike/:id",controller.unlikeFeed);
export const courseRoutes: Router = router;
