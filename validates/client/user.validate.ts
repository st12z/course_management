import { NextFunction, Request, Response } from "express";

export const registerPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập tên!");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email");
    res.redirect("back");
    return;
  }
  if (!req.body.password1) {
    req.flash("error", "Vui lòng nhập password");
    res.redirect("back");
    return;
  }
  if (!req.body.password2) {
    req.flash("error", "Vui lòng nhập password");
    res.redirect("back");
    return;
  }
  const password1 = req.body.password1;
  const password2 = req.body.password2;

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password1) ||!passwordRegex.test(password2) ) {
    req.flash(
      "error",
      "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm cả chữ cái và số."
    );
    res.redirect("back");
    return;
  }
  next();
};
export const loginPost= (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email");
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập password");
    res.redirect("back");
    return;
  }
  next();
};