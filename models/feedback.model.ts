import mongoose from "mongoose";
const feedBackSchema = new mongoose.Schema(
  {
   userId:String,
   courseId:String,
   rating:Number,
   review:String,
   like:{
    default:0,
    type:Number,
   }
  },
  {
    timestamps: true,
  }
);
const FeedBack = mongoose.model("FeedBack", feedBackSchema, "feedbacks");
export default FeedBack;
