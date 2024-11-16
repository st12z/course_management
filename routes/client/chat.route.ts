import {  Router } from "express";
import * as controller from "../../controllers/client/chat.controller";
const router: Router = Router();
router.get("/",controller.index)
export const chatRoutes: Router = router;
