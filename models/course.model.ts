import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: String,
    thumbnail:String,
    deleted: {
      type: Boolean,
      default: false,
    },
    slug: { 
      type: String, 
      slug: "title",
      unique:true,
    },
    price_special:Number,
    price:Number,
    participants:Number,
    duration:String,
    lecturesCount:Number,
    discount:Number,
    resources:{
      pdfLinks:[],
      videoDemo:String,
      learningPath:[]
    },
    tym:[],
    like:[],
    watch:Number,
    topicId:String,
    rating:Number,
  },
  {
    timestamps: true,
  }
);
const Course = mongoose.model("Course", courseSchema, "courses");
export default Course;
