import { cartRoutes } from "./cart.route"
import { courseRoutes } from "./courses.route"
import { favoriteCoursesRoutes } from "./favorite-courses.route"
import { topicRoutes } from "./topic.route"
import { Express } from "express"

export const clienRoutes=(app:Express)=>{
  app.use("/topics",topicRoutes),
  app.use("/courses",courseRoutes),
  app.use("/favorite-songs",favoriteCoursesRoutes),
  app.use("/cart",cartRoutes)
}