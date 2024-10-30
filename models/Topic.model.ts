import mongoose from "mongoose";
const topicSchema=new mongoose.Schema(
  {
    title:String,
    description:String,
    status:String,
    deleted:{
      type:Boolean,
      default:false
    },
  },
  {
    timestamps:true
  }
)
const Topic=mongoose.model("Topic",topicSchema,"topics");
export default Topic;