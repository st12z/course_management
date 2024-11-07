import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
dotenv.config();
export const infoMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user=await User.findOne({
        email:decoded.email,
        status:"active",
        deleted:false
      }).select("-password");
      res.locals.user=user;
    } catch (error) {

    }
  }
  next();
};
