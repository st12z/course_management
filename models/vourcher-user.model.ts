import mongoose from "mongoose";
const vourcherUserSchema = new mongoose.Schema(
  {
    vourcherId: String,
    userId: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
const VourcherUser = mongoose.model(
  "VourcherUser",
  vourcherUserSchema,
  "vourcher-user"
);
export default VourcherUser;
