import mongoose from "mongoose";
const otpSchema = new mongoose.Schema(
  {
    userId:String,
    otp:String,
    email:String,
    expireAt:{
      type:Date, 
      expires:0
    }
  },
  {
    timestamps: true,
  }
);
const  OTP= mongoose.model("OTP", otpSchema, "otps");
export default OTP;
