import mongoose from "mongoose";
const lectureSchema = new mongoose.Schema(
  {
    title: String,
    video:String,
    deleted: {
      type: Boolean,
      default: false,
    },
    subLessons:[]
  },
  {
    timestamps: true,
  }
);
const Lecture = mongoose.model("Lecture", lectureSchema, "lectures");
export default Lecture;
