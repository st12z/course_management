import mongoose from "mongoose";
const provinceSchema = new mongoose.Schema(
  {
    Id:Number,
    Code:String,
    Name:String
  },
  {
    timestamps: true,
  }
);
const  Province= mongoose.model("Province", provinceSchema, "provinces");
export default Province;
