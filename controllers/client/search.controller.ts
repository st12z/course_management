import { Request,Response } from "express";
import { convertSlug } from "../../helpers/convertSlug";
import Course from "../../models/course.model";
export const index=async(req:Request,res:Response)=>{
  const keyword:string=`${req.query.keyword}`;
  const slug=convertSlug(keyword);
  const regexKeyword=new RegExp(slug,"i");
  const type=req.params.type;
  switch(type){
    case "suggest":
      const courseSuggest=await Course.find({
        slug:regexKeyword,
        deleted:false,
        status:"active"
      });
      res.json({
        code:200,
        messages:"Tìm kiếm thành công",
        courseSuggest:courseSuggest
      })
      break;
    default:
      break;
  }
}