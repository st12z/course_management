import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
import passport from "passport";
import { generateAccessToken } from "../helpers/generateToken";
dotenv.config();
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access_token = req.cookies.access_token;
  if (!access_token) {
    res.redirect("/auth/login");
    return;
  }
  if (access_token) {
    try {
      const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findOne({
        email: decoded.email,
        status: "active",
        deleted: false,
      }).select("-password");
      if (!user) {
        res.redirect("/auth/login");
        return;
      }
      res.locals.user=user;
      next();
    } catch (error) {
      res.redirect("/auth/login");
      return;
    }
  }
 
};
