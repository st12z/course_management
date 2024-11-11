import mongoose from "mongoose";
const wardSchema = new mongoose.Schema(
  {
    Id:Number,
    Code:String,
    Name:String,
    DistrictId:Number
  },
  {
    timestamps: true,
  }
);
const  Ward= mongoose.model("Ward", wardSchema, "wards");
export default Ward;
