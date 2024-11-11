import { Request, Response } from "express";
import OrderItem from "../../models/order-item.model";
import Course from "../../models/course.model";
import Order from "../../models/order.model";
export const index = async (req: Request, res: Response) => {
  res.render("client/pages/track-order/index", {
    pageTitle: "Trang tra cứu đơn hàng",
  });
};
export const result = async (req: Request, res: Response) => {
  const orderId = req.query.orderId;
  const order = await Order.findOne({
    _id: orderId,
    status: "paid",
  });
  if (!order) {
    req.flash("error", "Đơn hàng không tồn tại");
    res.redirect("back");
    return;
  }
  const items = await OrderItem.find({
    orderId: orderId,
  });
  for (const item of items) {
    const courseId = item.courseId;
    const course = await Course.findOne({ _id: courseId }).select(
      "title thumbnail"
    );
    item["infoCourse"] = course;
  }
  const totalPriceCourse = order["totalPriceCourse"];
  const feeTrans = order["feeTrans"];
  const totalPayment = order["totalPayment"];

  res.render("client/pages/track-order/index", {
    pageTitle: "Trang tra cứu đơn hàng",
    items: items,
    totalPayment:totalPayment,
    totalPriceCourse:totalPriceCourse,
    feeTrans:feeTrans,
    orderId:orderId
  });
};
