import mongoose from "mongoose";
const userSchema =new mongoose.Schema({
  fullName:String,
  email:String,
  password:String,
  status:{
    type:String,
    default:"active"
  },
  deleted:{
    type:Boolean,
    default:false
  }
});
const User = mongoose.model("User",userSchema,"users");
export default User;