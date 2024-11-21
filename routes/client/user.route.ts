import {  Router } from "express";
import * as controller from "../../controllers/client/user.controller";
import multer from "multer";
import * as uploadCloudinary from "../../middlewares/upload.middleware";
import * as validate from "../../validates/client/user.validate";
const upload=multer();
const router: Router = Router();
router.get("/detail",controller.detail)
router.patch("/change-user",upload.single("avatar"),uploadCloudinary.uploadSingle,controller.changeUser);
router.get("/change-password",controller.changePassword);
router.patch("/change-password",validate.changPassword,controller.changePasswordPatch);
export const userRoutes: Router = router;
