import mongoose from "mongoose";
const districtSchema = new mongoose.Schema(
  {
    Id:Number,
    Code:String,
    Name:String,
    ProvinceId:Number
  },
  {
    timestamps: true,
  }
);
const  District= mongoose.model("District", districtSchema, "districts");
export default District;
