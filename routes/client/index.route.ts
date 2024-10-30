import { courseRoutes } from "./courses.route"
import { topicRoutes } from "./topic.route"
import { Express } from "express"

export const clienRoutes=(app:Express)=>{
  app.use("/topics",topicRoutes),
  app.use("/courses",courseRoutes)
}