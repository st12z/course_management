import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const streamUpload = (buffer: any) => {
  // Trả về 1 promise
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      }, // Đối tượng cấu hình
      (error, result) => {
        if (result) {
          resolve(result); // Thành công trả về result
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream); // Chuyển đổi buffer(nhị phân) thành stream sau đó đẩy vào
  });
};
export const uploadCloudinary = async (buffer: any) => {
  try {
    let result = await streamUpload(buffer);
    return result["url"];
  } catch (error) {
    console.error(error);
  }
};
