import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
const topicSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);
const Topic = mongoose.model("Topic", topicSchema, "topics");
export default Topic;
