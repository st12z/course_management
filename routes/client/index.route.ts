import { cartRoutes } from "./cart.route"
import { courseRoutes } from "./courses.route"
import { favoriteCoursesRoutes } from "./favorite-courses.route"
import { topicRoutes } from "./topic.route"
import { Express } from "express"
import { tryLearningRoutes } from "./try-learn.route"
import { homeRoutes } from "./home.route"
import { searchRoutes } from "./search.route"
import { authRoutes } from "./auth.route"
import * as authMiddlware from "../../middlewares/auth.middleware";
import { infoMiddleware } from "../../middlewares/info.midleware"
export const clienRoutes=(app:Express)=>{
  app.use(infoMiddleware);
  app.use("/",homeRoutes),
  app.use("/topics",topicRoutes),
  app.use("/courses",courseRoutes),
  app.use("/favorite-songs",authMiddlware.authMiddleware,favoriteCoursesRoutes),
  app.use("/cart",cartRoutes),
  app.use("/try",tryLearningRoutes),
  app.use("/search",searchRoutes),
  app.use("/auth",authRoutes)
}