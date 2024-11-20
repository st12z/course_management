import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const streamUpload = (buffer: any) => {  // Trả về 1 promise
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
const uploadCloudinary = async (buffer: any) => {
  let result = await streamUpload(buffer);
  return result["url"];
};
export const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req["file"]) {
      const result = await uploadCloudinary(req["file"].buffer);
      req.body[req["file"].fieldname] = result;
    }
  } catch (error) {
    console.log(error);
  }
  next();
};
export const uploadFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req["files"]);
    for (const key in req["files"]) {
      req.body[key] = [];
      const array = req["files"][key];
      for (const item of array) {
        try {
          const result =await uploadCloudinary(item.buffer);
          req.body[key].push(result);
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  next();
};
