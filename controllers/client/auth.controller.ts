import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { hashPassword } from "../../helpers/hassPassword";
import User from "../../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,

} from "../../helpers/generateToken";
import { generateCode } from "../../helpers/generateCode";
import OTP from "../../models/otp.model";
import { sendEmail } from "../../helpers/sendEmail";
import { sub } from "date-fns";
import { isTypedArray } from "util/types";

export const register = async (req: Request, res: Response) => {
  res.render("client/pages/auth/register", {
    pageTitle: "Trang đăng kí",
  });
};
export const registerPost = async (req: Request, res: Response) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const existUser = await User.findOne({
    email: email,
    status: "active",
    deleted: false,
  });
  console.log(existUser);
  if (existUser) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }

  if (req.body.password1 != req.body.password2) {
    req.flash("error", "Vui lòng nhập mật khẩu giống nhau!");
    res.redirect("back");
    return;
  }
  req.flash("success", "Đăng kí thành công!");
  const password1 = await hashPassword(`${req.body.password1}`);
  const dataUser = {
    email: email,
    fullName: fullName,
    password: password1,
  };
  const user = new User(dataUser);
  await user.save();
  res.redirect("back");
};
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/auth/login", {
    pageTitle: "Trang đăng nhập",
  });
};
export const loginPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const existUser = await User.findOne({
    email: email,
    status: "active",
    deleted: false,
  });
  if (!existUser) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  const passwordHash = existUser.password;
  const password = req.body.password;
  try {
    const checkPassword = await bcrypt.compare(password, passwordHash);
    if (!checkPassword) {
      req.flash("error", "Mật khẩu không đúng");
      res.redirect("back");
      return;
    }
    const access_token = generateAccessToken({
      fullName: existUser.fullName,
      email: existUser.email,
    });
    const refresh_token = generateRefreshToken({
      fullName: existUser.fullName,
      email: existUser.email,
    });
    await User.updateOne(
      { email: email },
      { $push: { refreshTokens: refresh_token } }
    );
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("back");
  }
};
export const logout = async (req: Request, res: Response) => {
  const refresh_token=req.cookies.refresh_token;
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  await User.updateOne({
    _id:res.locals.user.id,
    $pull:{refreshTokens:refresh_token}
  });
  res.redirect("/auth/login");
};
export const forgotPassword = async (req: Request, res: Response) => {
  res.render("client/pages/auth/forgot-password",{
    paegTitle:"Quên mật khẩu"
  })
};
export const forgotPasswordPost = async (req: Request, res: Response) => {
  const email=req.body.email;
  const user=await User.findOne({email:email,deleted:false,status:"active"}).select("-password");
  if(!user){
    req.flash("error","Email không tồn tại!");
    res.redirect("back");
  }
  const otpCode=generateCode(6);
  const dataOTP={
    userId:user.id,
    email:user.email,
    otp:otpCode,
    expireAt:new Date(Date.now() + 3*60*1000)
  };
  const otp=new OTP(dataOTP);
  await otp.save();
  const subject="Mã OTP";
  const html=`<p><b>Mã OTP của bạn là: </b>${otpCode}. Mã có thời hạn trong 3 phút.</p>`;
  sendEmail(subject,html);
  res.redirect(`/auth/otp/${email}`)
};
export const otp = async (req: Request, res: Response) => {
  const email=req.params.email;
  res.render("client/pages/auth/otp",{
    pageTitle:"Nhập mã OTP",
    email:email
  })
};
export const otpPost = async (req: Request, res: Response) => {
  const email=req.body.email;
  const otp=req.body.otp;
  const Otp=await OTP.findOne({
    email:email,
    otp:otp
  });
  if(!Otp){
    req.flash("error","Mã OTP không hợp lệ!");
    res.redirect("back");
    return;
  }
  res.redirect(`/auth/reset-password/${email}`);
};
export const resetPassword = async (req: Request, res: Response) => {
  const email=req.params.email;
  res.render("client/pages/auth/reset-password",{
    pageTitle:"Nhập mã OTP",
    email:email
  })
};
export const resetPasswordPost = async (req: Request, res: Response) => {
  const email=req.params.email;
  const password1=req.body.password1;
  const password2=req.body.password2;
  if(password1!=password2){
    req.flash("error","Mật khẩu không trùng!");
    res.redirect("back");
    return;
  }
  await User.updateOne({
    email:email
  },{password: await hashPassword(password1)});
  res.redirect("/auth/login");
};