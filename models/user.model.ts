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
  },
  avatar:{
    type:String,
    default:"https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg"
  },
  requestFriends:[],
  acceptFriends:[],
  isFriends:[],
  slug: { 
    type: String, 
    slug: "fullName",
    unique:true,
  },
  refreshTokens:[]
},{
  timestamps:true
});
const User = mongoose.model("User",userSchema,"users");
export default User;