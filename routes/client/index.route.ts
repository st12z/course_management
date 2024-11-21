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
import { addressRoutes } from "./address.route"
import { paymentRoutes } from "./payment.route"
import { trackOrderRoutes } from "./track-order.route"
import { vourcherRoutes } from "./vourcher.route"
import { friendRoutes } from "./friends.route"
import { chatRoutes } from "./chat.route"
import { userRoutes } from "./user.route"
export const clienRoutes=(app:Express)=>{
  app.use(infoMiddleware);
  app.use("/",homeRoutes),
  app.use("/topics",topicRoutes),
  app.use("/courses",courseRoutes),
  
  app.use("/favorite-songs",authMiddlware.authMiddleware,favoriteCoursesRoutes),
  app.use("/cart",cartRoutes),
  app.use("/try",tryLearningRoutes),
  app.use("/search",searchRoutes),
  app.use("/auth",authRoutes),
  app.use("/address",addressRoutes),
  app.use("/payment",authMiddlware.authMiddleware,paymentRoutes),
  app.use("/track-order",trackOrderRoutes),
  app.use("/vourchers",vourcherRoutes),
  app.use("/friends",authMiddlware.authMiddleware,friendRoutes)
  app.use("/chats",authMiddlware.authMiddleware,chatRoutes)
  app.use("/user",authMiddlware.authMiddleware,userRoutes)
 
}