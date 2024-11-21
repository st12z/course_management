import mongoose from "mongoose";
const orderItemSchema = new mongoose.Schema(
  {
    orderId:String,
    quantity:Number,
    codeActive:String,
    courseId:String,
    deleted: {
      type: Boolean,
      default: false,
    },
    status:{
      type:String,
      default:"intactive"
    }
  },
  {
    timestamps: true,
  }
);
const OrderItem = mongoose.model("OrderItem", orderItemSchema, "order-items");
export default OrderItem;
