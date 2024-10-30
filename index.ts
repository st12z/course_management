import express,{ Express,Request,Response } from "express";
import dotenv from "dotenv";
import Topic from "./models/Topic.model";
import *as database from "./config/database";
dotenv.config();
database.connect();
const app:Express=express();
const PORT:number|string=process.env.PORT;

app.use("/topics",async (req:Request,res:Response)=>{
  const topics=await Topic.find({deleted:false});
  res.json({
    topics:topics
  })
});
app.listen(PORT,()=>{
  console.log(`App listening or port ${PORT}`);
})
