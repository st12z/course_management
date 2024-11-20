import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
import { generateAccessToken } from "../helpers/generateToken";
dotenv.config();
export const infoMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;
  if (access_token) {
    try {
      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      const user = await User.findOne({
        email: (decoded as any).email,
        status: "active",
        deleted: false,
      }).select("-password");

      if (!user) {
        return res.redirect("/auth/login");
      }
      res.locals.user = user;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.log("Access token đã hết hạn, đang kiểm tra refresh_token...");
      }
    }
  }

  if (refresh_token) {
    try {
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as string
      );
      const user = await User.findOne({
        email: (decoded as any).email,
        status: "active",
        deleted: false,
        refreshTokens: refresh_token,
      }).select("-password");

      if (!user) {
        return res.redirect("/auth/login");
      }
      const newAccessToken = generateAccessToken(user);
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000, // 15 phút
      });

      res.locals.user = user;
      return next();
    } catch (error) {
      console.error("Refresh token không hợp lệ hoặc hết hạn.", error);
      return res.redirect("/auth/login");
    }
  }

  next();
};
