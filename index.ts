import express,{ Express,Request,Response } from "express";
import dotenv from "dotenv";
import *as database from "./config/database";
import { clienRoutes } from "./routes/client/index.route";
import path from "path";
dotenv.config();
database.connect();
const app:Express=express();
const PORT:number|string=process.env.PORT;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
clienRoutes(app);
app.listen(PORT,()=>{
  console.log(`App listening or port ${PORT}`);
})
