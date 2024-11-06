import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateToken=(user)=>{
  const payload={
    fullName:user.fullName,
    email:user.email,
  }
  return jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'15m'});
}