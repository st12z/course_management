import {  Router } from "express";
import * as controller from "../../controllers/client/address.controller";
const router: Router = Router();
router.get("/province/:provinceId",controller.province);
router.get("/district/:districtId",controller.district);
export const addressRoutes: Router = router;
