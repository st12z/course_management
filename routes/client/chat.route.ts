import {  Router } from "express";
import * as controller from "../../controllers/client/chat.controller";
import multer from "multer";

const router: Router = Router();
router.get("/",controller.index)
router.get("/rooms/:roomChatId",controller.chat);
router.get("/friend/suggest",controller.suggest);


export const chatRoutes: Router = router;
