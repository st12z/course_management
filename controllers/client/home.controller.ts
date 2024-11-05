import { Request,Response } from "express";
import Topic from "../../models/topic.model";
export const index=async(req:Request,res:Response)=>{
  res.send("OK");
}