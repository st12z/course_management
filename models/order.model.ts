import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    fullName:String,
    province:String,
    district:String,
    ward:String,
    phone:String,
    detailAddress:String,
    userId:String,
    transId:String,
    status:{
      type:String,
      default:"processing"
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    totalPayment:Number,
    totalPriceCourse:Number,
    feeTrans:Number
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema, "orders");
export default Order;
