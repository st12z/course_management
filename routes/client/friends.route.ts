import {  Router } from "express";
import * as controller from "../../controllers/client/friends.controller";
const router: Router = Router();
router.get("/",controller.index);
router.get("/not-friends",controller.notFriends);
router.get("/accept",controller.acceptFriends);
router.get("/request",controller.requestFriends);
export const friendRoutes: Router = router;
