import { Request, Response } from "express";
import Course from "../../models/course.model";
export const index = async (req: Request, res: Response) => {
  console.log(req.body);
  res.render("client/pages/cart/index", {
    pageTitle: "Trang giỏ hàng",
  });
};
export const listJson = async (req: Request, res: Response) => {
  const courseIds = req.body;
  const courses = [];
  let totalPayment = 0;

  for (const item of courseIds) {
    const courseId = item.courseId;
    const quantity = item.quantity;
    const course = await Course.findOne({ _id: courseId });

    const infoCourse = { ...course.toObject() }; // Chuyển course thành object và tạo bản sao mới
    infoCourse["price_special"] =
      infoCourse["price"] * (1 - infoCourse["discount"] / 100);
    const totalPrice = infoCourse["price_special"] * quantity;

    courses.push({
      infoCourse: infoCourse,
      totalPrice: totalPrice,
      quantity: quantity,
    });

    totalPayment += totalPrice;
  }
  console.log(courses);
  res.json({
    code: 200,
    courses: courses,
    totalPayment: totalPayment,
  });
};
