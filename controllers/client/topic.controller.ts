import { Request,Response } from "express";
import Topic from "../../models/Topic.model";
export const index=async(req:Request,res:Response)=>{
  const topics=await Topic.find({deleted:false});
  res.render("client/pages/topics/index",{
    pageTitle:"Trang danh sách chủ đề khóa học",
  })
}