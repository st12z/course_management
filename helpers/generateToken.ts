import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateAccessToken=(user)=>{
  const payload={
    fullName:user.fullName,
    email:user.email,
  }
  return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30m'});
}
export const generateRefreshToken=(user)=>{
  const payload={
    fullName:user.fullName,
    email:user.email,
  }
  return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
}