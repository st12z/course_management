import { Response, Request } from "express";
import Chat from "../models/chat.model";
import { uploadCloudinary } from "../helpers/uploadToCloudinaryChat";
export const chatSocket = (req: Request, res: Response) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const avatar = res.locals.user.avatar;
  _io.once("connection", (socket) => {
    socket.join(roomChatId);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const roomChatId = data.roomChatId;
      const content = data.content;
      const imagesBuffer=data.images;
      const images=[];
      if(imagesBuffer && imagesBuffer.length!=0){
        for(const buffer of imagesBuffer){
          const url=await uploadCloudinary(buffer);
          console.log(url);
          images.push(url);
        }
      }
      if (content != "" || images.length) {
        const dataChat = {
          userId: userId,
          content: content,
          roomChatId: roomChatId,
          images:images
        };
        const chat = new Chat(dataChat);
        await chat.save();
        try {
          _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
            userId: userId,
            content: content,
            fullName: fullName,
            avatar: avatar,
            images:images
          });
        } catch (error) {
          console.error(error);
        }
      }
      
    });
  });
};
