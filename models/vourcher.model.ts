import mongoose from "mongoose";
const vourcherSchema = new mongoose.Schema(
  {
    title:String,
    status:{
      type:String,
      default:"active"
    },
    deleted:{
      type:Boolean,
      default:false
    },
    discountPercent:Number,
    thumbnail:String,
    expireAt:Date,
    condition:Number,
    used:[]
  },
  {
    timestamps: true,
  }
);
const  Vourcher= mongoose.model("Vourcher", vourcherSchema, "vourchers");
export default Vourcher;
