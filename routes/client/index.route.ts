import { cartRoutes } from "./cart.route"
import { courseRoutes } from "./courses.route"
import { favoriteCoursesRoutes } from "./favorite-courses.route"
import { topicRoutes } from "./topic.route"
import { Express } from "express"
import { tryLearningRoutes } from "./try-learn.route"
import { homeRoutes } from "./home.route"
import { searchRoutes } from "./search.route"

export const clienRoutes=(app:Express)=>{
  app.use("/",homeRoutes),
  app.use("/topics",topicRoutes),
  app.use("/courses",courseRoutes),
  app.use("/favorite-songs",favoriteCoursesRoutes),
  app.use("/cart",cartRoutes),
  app.use("/try",tryLearningRoutes),
  app.use("/search",searchRoutes)
}