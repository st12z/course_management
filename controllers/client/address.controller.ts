import { Request,Response } from "express";
import Topic from "../../models/topic.model";
import District from "../../models/district.model";
import Ward from "../../models/ward.model";
export const province=async(req:Request,res:Response)=>{
  const provinceId=req.params.provinceId;
  const districts=await District.find({
    ProvinceId:provinceId
  });
  res.json({
    code:200,
    messages:"Lấy dữ liệu thành công!",
    districts:districts
  })
}
export const district=async(req:Request,res:Response)=>{
  const districtId=req.params.districtId;
  const wards=await Ward.find({
    DistrictId:districtId
  });
  res.json({
    code:200,
    messages:"Lấy dữ liệu thành công!",
    wards:wards
  })
}