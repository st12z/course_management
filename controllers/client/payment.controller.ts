import { Request, Response } from "express";
import Province from "../../models/province.model";
import District from "../../models/district.model";
import Ward from "../../models/ward.model";
import Course from "../../models/course.model";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import axios from "axios";
import moment from "moment";
dotenv.config();
import qs from "qs";
import { generateCode } from "../../helpers/generateCode";
import OrderItem from "../../models/order-item.model";
import Order from "../../models/order.model";
import VourcherUser from "../../models/vourcher-user.model";
import Vourcher from "../../models/vourcher.model";
const config = {
  appid: `${process.env.APP_ID}`,
  key1: `${process.env.KEY1}`,
  key2: `${process.env.KEY2}`,
  endpoint: `${process.env.ENDPOINT}`,
};
export const checkOut = async (req: Request, res: Response) => {
  const provinceId = req.query.provinceId;
  const districtId = req.query.districtId;
  const wardId = req.query.wardId;
  const carts = req.query.cart ? JSON.parse(req.query.cart as string) : [];
  if(!carts || carts.length==0){
    req.flash("error","Bạn vui lòng thêm sản phẩm!");
    res.redirect("back");
    return;
  }
  const items = [];
  let totalPayment = 0;
  for (const cart of carts) {
    const courseId = cart.courseId;
    const quantity = cart.quantity;
    const course = await Course.findOne({ _id: courseId });
    course["price_special"] = course["price"] * (1 - course["discount"] / 100);
    const totalPrice = course["price_special"] * quantity;
    const item = {
      quantity: quantity,
      infoCourse: {
        ...course.toObject(), // chuyển course thành object thường để tránh mất dữ liệu khi stringify
        price_special: course["price_special"],
      },
      totalPrice: totalPrice,
    };
    totalPayment += totalPrice;
    items.push(item);
  }
  const province = await Province.findOne({
    Id: provinceId,
  });
  const district = await District.findOne({
    Id: districtId,
  });
  const ward = await Ward.findOne({ Id: wardId });
  const dataUser = {
    fullName: `${req.query["fullName"]}`,
    phone: req.query["phone"],
    provinceName: province["Name"],
    districtName: district["Name"],
    wardName: ward["Name"],
    detailAddress: req.query.detailAddress,
  };
  // get vourcher
  const userId=res.locals.user.id;
  const vourcherUsers=await VourcherUser.find({
    userId:userId,
    deleted:false,
    status:"active"
  });
  const vourchers=[];
  for(const vourcherUser of vourcherUsers){
    const vourcher=await Vourcher.findOne({
      _id:vourcherUser["vourcherId"]
    });
    vourchers.push(vourcher);
  }
  // end get vourcher
  res.render("client/pages/payment/index", {
    pageTitle: "Trang thanh toán",
    dataUser: dataUser,
    items: items,
    totalPayment: totalPayment,
    vourchers:vourchers
  });
};

export const processing = async (req: Request, res: Response) => {
  const transId = Math.floor(Math.random() * 100000000);
  const apptransId = `${moment().format("YYMMDD")}_${transId}`;
  const embeddata = {
    merchantinfo: {
      fullName: req.body.fullName,
      phone: req.body.phone,
      province: req.body.province,
      district: req.body.district,
      ward: req.body.ward,
      detailAddress: req.body.detailAddress,
    },
    redirecturl: `http://localhost:3000/payment/order-status/${apptransId}`,
  };

  const carts = JSON.parse(req.body.carts as string);
  console.log(carts);
  const dataItems = [];
  const items = [];
  let amount = 0;
  const dataOrder = {
    fullName: req.body.fullName,
    phone: req.body.phone,
    province: req.body.province,
    district: req.body.district,
    ward: req.body.ward,
    detailAddress: req.body.detailAddress,
    userId: res.locals.user.id,
    transId: apptransId,
  };
  const orderDB = new Order(dataOrder);
  await orderDB.save();
  for (const cart of carts) {
    const courseId = cart.courseId;
    const quantity = cart.quantity;
    const course = await Course.findOne({ _id: courseId });
    course["price_special"] = course["price"] * (1 - course["discount"] / 100);
    const item = {
      quantity: quantity,
      infoCourse: {
        ...course.toObject(), // chuyển course thành object thường để tránh mất dữ liệu khi stringify
        price_special: course["price_special"],
      },
    };
    dataItems.push(item);
  }
  for (const item of dataItems) {
    items.push({
      id: item.infoCourse["_id"],
      title: item.infoCourse.title,
      price_special: item.infoCourse["price_special"],
      price: item.infoCourse.price,
      quantity: item.quantity,
      total_price: item.infoCourse["price_special"] * item.quantity,
    });
    const dataOrderItem = {
      orderId: orderDB["id"],
      courseId: item.infoCourse["_id"],
      quantity: item.quantity,
      codeActive: generateCode(10),
    };
    const orderItem = new OrderItem(dataOrderItem);
    await orderItem.save();
    amount += item.infoCourse["price_special"] * item.quantity;
  }

  orderDB["totalPayment"] = amount;
  await orderDB.save();
  const order = {
    appid: config.appid,
    apptransid: `${apptransId}`, // mã giao dich có định dạng yyMMdd_xxxx
    appuser: "demo",
    apptime: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embeddata: JSON.stringify(embeddata),
    amount: amount,
    description: `Lazada - Payment for the order ${transId}`,
    bankcode: "",
    callback_url: "https://32c7-42-118-51-109.ngrok-free.app/payment/callback",
  };

  // appid|apptransid|appuser|amount|apptime|embeddata|item
  const data =
    config.appid +
    "|" +
    order.apptransid +
    "|" +
    order.appuser +
    "|" +
    order.amount +
    "|" +
    order.apptime +
    "|" +
    order.embeddata +
    "|" +
    order.item;
  order["mac"] = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log(result["data"]);
    if (result["data"]["returncode"] == 1) {
      res.json({
        code: "200",
        orderUrl:result["data"]["orderurl"],
        messages: "Quá trình đang thanh toán!",
      });
    } else {
      res.json({
        code: 400,
        messages: "Quá trình thanh toán bị lỗi!",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      messages: "Quá trình thanh toán bị lỗi",
    });
  }
};
export const callBack = async (req: Request, res: Response) => {
  let result = {};
  console.log(req.body);
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    // Tạo mã MAC từ dataStr
    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // Kiểm tra mã MAC
    if (reqMac !== mac) {
      result["returncode"] = -1;
      result["returnmessage"] = "mac not equal";
    } else {
      // Nếu dataStr cần giải mã, sử dụng CryptoJS để giải mã trước khi parse
      let decryptedStr = CryptoJS.AES.decrypt(dataStr, config.key2).toString(
        CryptoJS.enc.Utf8
      );
      let dataJson = JSON.parse(decryptedStr);

      console.log(
        "update order's status = success where apptransid =",
        dataJson["apptransid"]
      );

      result["returncode"] = 1;
      result["returnmessage"] = "success";
    }
  } catch (ex) {
    result["returncode"] = 0;
    result["returnmessage"] = ex.message;
  }

  res.json(result);
};
export const order = async (req: Request, res: Response) => {
  const apptransId = req.params.apptransId;
  let postData = {
    appid: config.appid,
    apptransid: apptransId, // Input your apptransid
  };

  let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
  postData["mac"] = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };
  try {
    const result = await axios(postConfig);

    if (result["data"].returncode == 1) {
      await Order.updateOne(
        {
          transId: apptransId,
        },
        { status: "paid" }
      );
      const order = await Order.findOne({ transId: apptransId });
      const orderId = order["id"];
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
      const totalPriceCourse = parseInt(result["data"].amount);
      const feeTrans = parseInt(result["data"].userfeeamount);
      const totalPayment = totalPriceCourse + feeTrans;
      order["totalPriceCourse"] = totalPriceCourse;
      order["feeTrans"] = feeTrans;
      order["totalPayment"] = totalPayment;
      await order.save();
      res.render("client/pages/payment/order-success", {
        pageTitle: "Thông tin đơn hàng đã thanh toán",
        items: items,
        totalPayment: totalPayment,
        totalPriceCourse: totalPriceCourse,
        feeTrans: feeTrans,
        appTransId: apptransId,
        orderId: orderId,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
