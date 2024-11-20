import mongoose from "mongoose";
const roomChatSchema = new mongoose.Schema(
  {
    typeRoom:String,
    users:[
      {
        userId:String,
        role:String
      }
    ],
    deleted:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);
const  RoomChat= mongoose.model("RoomChat", roomChatSchema, "room-chats");
export default RoomChat;
