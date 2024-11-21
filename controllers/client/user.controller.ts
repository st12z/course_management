import { Request, Response } from "express";
import Course from "../../models/course.model";
import Province from "../../models/province.model";
import User from "../../models/user.model";
import bcrypt from "bcrypt";
import { hashPassword } from "../../helpers/hassPassword";
export const detail = async (req: Request, res: Response) => {
  res.render("client/pages/users/detail", {
    pageTitle: "Thông tin người dùng",
  });
};
export const changeUser = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const email = req.body.email;
  const fullName = req.body.fullName;
  const avatar = req.body.avatar ? req.body.avatar : user.avatar;
  await User.updateOne(
    {
      _id: user.id,
    },
    {
      email: email,
      fullName: fullName,
      avatar: avatar,
    }
  );
  req.flash("success", "Cập nhật thông tin thành công!");
  res.redirect("back");
};
export const changePassword = async (req: Request, res: Response) => {
  res.render("client/pages/users/change-password", {
    pageTitle: "Thay đổi mật khẩu",
  });
};
export const changePasswordPatch = async (req: Request, res: Response) => {
  console.log(req.body);
  const email = req.body.email;
  const password = await hashPassword(req.body.password);
  const password1 = req.body.password1;
  const password2 = req.body.password2;
  const userId = res.locals.user;
  const user = await User.findOne({ email: email });
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    req.flash("error", "Mật khẩu không đúng!");
    res.redirect("back");
    return;
  }
  if (password1 != password2) {
    req.flash("error", "Mật khẩu nhập không trùng!");
    return res.redirect("back");
  }
  const newHashPassword = await hashPassword(password1);
  await User.updateOne(
    {
      email: email,
    },
    {
      password: newHashPassword,
    }
  );
  req.flash("success", "Bạn đã thay đổi mật khẩu thành công!");
  res.redirect("back");
};
