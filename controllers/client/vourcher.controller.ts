import { Request, Response } from "express";
import Vourcher from "../../models/vourcher.model";
import VourcherUser from "../../models/vourcher-user.model";
import Order from "../../models/order.model";
import OrderItem from "../../models/order-item.model";
import { order } from "./payment.controller";

export const index = async (req: Request, res: Response) => {
  const vourchers = await Vourcher.find({
    deleted: false,
    status: "active",
  });
  const user = res.locals.user;
  if (user) {
    for (const vourcher of vourchers) {
      const vourcherId = vourcher["id"];
      const vourcherUser = await VourcherUser.findOne({
        vourcherId: vourcherId,
        userId: user.id,
      });
      if (vourcherUser) {
        vourcher["vourcherUser"] = true;
      } else {
        vourcher["vourcherUser"] = false;
      }
    }
  }

  res.render("client/pages/vourcher/index", {
    pageTitle: "Trang vourcher",
    vourchers: vourchers,
  });
};
export const save = async (req: Request, res: Response) => {
  if (!req.cookies.token) {
    res.json({
      code: 400,
      messages: "Bạn cần đăng nhập để lưu vourcher!",
    });
    return;
  }
  const vourcherId = req.body.vourcherId;
  const userId = res.locals.user.id;
  const orders = await Order.find({
    deleted: false,
    status: "paid",
    userId:userId
  });
  let count = 0;
  for (const order of orders) {
    const orderId = order.id;
    const orderItems = await OrderItem.find({ orderId: orderId });
    count+=orderItems.reduce((sum,item)=>sum+=item.quantity,0);
  }
  const vourcher = await Vourcher.findOne({
    _id: vourcherId,
    deleted: false,
    status: "active",
  });
  if (vourcher["condition"] <= count) {
    const dataVourcherUser = {
      vourcherId: vourcherId,
      userId: userId,
    };
    const vourcherUser = new VourcherUser(dataVourcherUser);
    await vourcherUser.save();
    res.json({
      code: 200,
      messages: "Bạn đã lưu thành công!",
    });
  }
  else{
    res.json({
      code:400,
      messages:"Bạn chưa đủ điều kiện để có vourcher này!"
    })
  }
};
