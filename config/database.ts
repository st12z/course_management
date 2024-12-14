import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connect=async()=>{
  try{
    await mongoos.connect(process.env.MONGO_URL);
    console.log("Connect success");
  }catch(error){
    console.log("Connect fail")
  }
}
