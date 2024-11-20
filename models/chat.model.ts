import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    userId:String,
    content:String,
    roomChatId:String,
    deleted:{
      type:Boolean,
      default:false
    },
    images:[]
  },
  {
    timestamps: true,
  }
);
const  Chat= mongoose.model("Chat", chatSchema, "chats");
export default Chat;
