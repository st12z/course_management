import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
dotenv.config();
export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
  const token=req.cookies.token;
  if(!token){
    res.redirect("/auth/login");
    return;
  }
  try{
    const decoded=jwt.verify(token,process.env.SECRET_KEY);
    console.log(decoded);
    res.locals.user={
      fullName:decoded.fullName,
      email:decoded.email
    }
  }catch(error){
    console.error("Invalid Token");
    res.redirect("/auth/login");
    return;
  }
  
  next();
}