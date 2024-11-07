import mongoose from "mongoose";
const favoriteCourseSchema = new mongoose.Schema(
  {
    courseId:String,
    userId:String,
    deleted:{
      type:Boolean,
      default:false,
    },
    status:{
      type:String,
      default:"active"
    },
  },
  {
    timestamps: true,
  }
);
const FavoriteCourse= mongoose.model("FavoriteCourse", favoriteCourseSchema, "favorite-courses");
export default FavoriteCourse;
