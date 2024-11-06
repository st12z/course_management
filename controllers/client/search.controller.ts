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
    case "result":
      const courses=await Course.find({
        deleted:false,
        status:"active",
        $or:[
          {slug:regexKeyword},
          {title:regexKeyword},
        ]
      });
      for (const course of courses) {
        course["price_special"] = course["price"] * (1 - course["discount"] / 100);
      }
      res.render("client/pages/search/result",{
        pageTitle:"Kết quả tìm kiếm",
        courses:courses,
        keyword:keyword
      })
      break;
    default:
      break;
  }
}