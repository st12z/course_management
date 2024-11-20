import { Response } from "express";
import User from "../models/user.model";
import RoomChat from "../models/room-chat.model";
export const friendSocket = (res: Response) => {
  _io.once("connection", (socket) => {
    const user = res.locals.user;
    const userAId = user.id;
    socket.on("CLIENT_SEND_REQUEST", async (userBId) => {
      console.log(userBId);
      const userBinA = await User.findOne({
        _id: userAId,
        requestFriends: userBId,
      });
      const userAinB = await User.findOne({
        _id: userBId,
        acceptFriends: userAId,
      });
      if (!userBinA && !userAinB) {
        await User.updateOne(
          {
            _id: userBId,
          },
          { $push: { acceptFriends: userAId } }
        );
        await User.updateOne(
          {
            _id: userAId,
          },
          { $push: { requestFriends: userBId } }
        );
        const requestFriendsOfA = (await User.findOne({ _id: userAId }))
          .requestFriends;
        socket.emit(
          "SERVER_RETURN_AMOUNT_REQUEST_FRIENDS",
          requestFriendsOfA.length
        );
        const acceptFriendsOfB = (await User.findOne({ _id: userBId }))
          .acceptFriends;
        socket.broadcast.emit("SERVER_RETURN_AMOUNT_ACCEPT_FRIENDS", {
          lengthAccept: acceptFriendsOfB.length,
          userBId: userBId,
        });
        const infoUserA = await User.findOne({ _id: userAId }).select(
          "id fullName avatar"
        );
        socket.broadcast.emit("SERVER_RETURN_INFOR_REQUEST", {
          infoUser: infoUserA,
          userBId: userBId,
        });
      }
    });
    socket.on("CLIENT_SEND_CANCEL", async (userBId) => {
      const userBinA = await User.findOne({
        _id: userAId,
        requestFriends: userBId,
      });
      const userAinB = await User.findOne({
        _id: userBId,
        acceptFriends: userAId,
      });
      if (userBinA && userAinB) {
        await User.updateOne(
          {
            _id: userAId,
          },
          { $pull: { requestFriends: userBId } }
        );
        await User.updateOne(
          {
            _id: userBId,
          },
          { $pull: { acceptFriends: userAId } }
        );
        const requestFriendsOfA = (await User.findOne({ _id: userAId }))
          .requestFriends;
        socket.emit(
          "SERVER_RETURN_AMOUNT_REQUEST_FRIENDS",
          requestFriendsOfA.length
        );
        const acceptFriendsOfB = (await User.findOne({ _id: userBId }))
          .acceptFriends;
        socket.broadcast.emit("SERVER_RETURN_AMOUNT_ACCEPT_FRIENDS", {
          lengthAccept: acceptFriendsOfB.length,
          userBId: userBId,
        });
        const infoUserA = await User.findOne({ _id: userAId }).select(
          "id fullName avatar"
        );
        socket.broadcast.emit("SERVER_RETURN_INFOR_CANCEL", {
          infoUser: infoUserA,
          userBId: userBId,
        });
      }
    });
    socket.on("CLIENT_SEND_ACCEPT", async (userBId) => {
      const userBinA = await User.findOne({
        _id: userAId,
        acceptFriends: userBId,
      });
      const userAinB = await User.findOne({
        _id: userBId,
        requestFriends: userAId,
      });
      const notFriendAwithB = await User.findOne({
        _id: userAId,
        isFriends: userBId,
      });
      const notFriendBwithA = await User.findOne({
        _id: userBId,
        isFriends: userAId,
      });
      if (userBinA && userAinB && !notFriendBwithA && !notFriendAwithB) {
        // Cập nhật isFriend
        await User.updateOne(
          {
            _id: userAId,
          },
          {
            $push: { isFriends: userBId },
          }
        );
        await User.updateOne(
          {
            _id: userBId,
          },
          {
            $push: { isFriends: userAId },
          }
        );
        // Xóa lời gửi,chấp nhận
        await User.updateOne(
          {
            _id: userAId,
          },
          {
            $pull: { acceptFriends: userBId },
          }
        );
        await User.updateOne(
          {
            _id: userBId,
          },
          {
            $pull: { requestFriends: userAId },
          }
        );
        // Thêm vào phòng chat
        const roomData = {
          typeRoom: "friend",
          users: [
            {
              userId: userAId,
              role: "admin",
            },
            {
              userId: userBId,
              role: "admin",
            },
          ],
        };
        const roomChat = new RoomChat(roomData);
        await roomChat.save();
        const roomChatFind = await RoomChat.findOne({
          typeRoom: "friend",
          $and: [
            { users: { $elemMatch: { userId: userAId, role: "admin" } } },
            { users: { $elemMatch: { userId: userBId, role: "admin" } } },
          ],
        });
        const userA = await User.findOne({ _id: userAId });
        const userB = await User.findOne({ _id: userBId });
        const acceptFriendsOfA = userA.acceptFriends;
        const requestFriendsOfB = userB.requestFriends;
        const isFriendOfA = userA.isFriends;
        const isFriendOfB = userB.isFriends;
        socket.emit("SERVER_RETURN_AMOUNT_ACCEPT_FRIENDS_AFTER_ACCEPTED", {
          lengthAcceptFriends: acceptFriendsOfA.length,
        });
        console.log(requestFriendsOfB.length, userBId, userAId);
        socket.broadcast.emit(
          "SERVER_RETURN_AMOUNT_REQUEST_FRIENDS_AFTER_ACCEPTED",
          {
            lengthRequest: requestFriendsOfB.length,
            userBId: userBId,
            userAId: userAId,
          }
        );
        const infoUserA = await User.findOne({ _id: userAId }).select(
          "id fullName avatar"
        );
        _io.emit("SERVER_RETURN_ISFRIEND", {
          infoUser: infoUserA,
          userBId: userBId,
          lengthIsFriendsOfA: isFriendOfA.length,
          lengthIsFriendsOfB: isFriendOfB.length,
          roomChatId:roomChatFind["id"] ? roomChatFind["id"]:null
        });
      }
    });
    socket.on("CLIENT_SEND_REFUSE", async (userBId) => {
      const userAinB = await User.findOne({
        _id: userBId,
        requestFriends: userAId,
      });
      const userBinA = await User.findOne({
        _id: userAId,
        acceptFriends: userBId,
      });
      if (userAinB && userBinA) {
        await User.updateOne(
          {
            _id: userAId,
          },
          {
            $pull: { acceptFriends: userBId },
          }
        );
        await User.updateOne(
          {
            _id: userBId,
          },
          {
            $pull: { requestFriends: userAId },
          }
        );
      }
      const userA = await User.findOne({ _id: userAId }).select("-password");
      const userB = await User.findOne({ _id: userBId }).select("-password");
      socket.emit("SERVER_RETURN_AMOUNT_ACCEPT_FRIENDS_AFTER_REFUSED", {
        lengthAcceptFriends: userA.acceptFriends.length,
      });
      socket.broadcast.emit(
        "SERVER_RETURN_AMOUNT_REQUEST_FRIENDS_AFTER_REFUSED",
        {
          lengthRequestFriends: userB.requestFriends.length,
          userBId: userB.id,
          userAId: userAId,
        }
      );
    });
    socket.on("CLIENT_SEND_DELETE", async (userBId) => {
      console.log(userBId);
      const userAinB = await User.findOne({
        _id: userAId,
        isFriends: userBId,
      });
      const userBinA = await User.findOne({
        _id: userBId,
        isFriends: userAId,
      });
      if (userAinB && userBinA) {
        await User.updateOne(
          { _id: userAId },
          { $pull: { isFriends: userBId } }
        );
        await User.updateOne(
          { _id: userBId },
          { $pull: { isFriends: userAId } }
        );
        const userA = await User.findOne({ _id: userAId });
        const userB = await User.findOne({ _id: userBId });
        const lengthIsFriendsOfA = userA.isFriends.length;
        const lengthIsFriendsOfB = userB.isFriends.length;
        _io.emit("SERVER_RETURN_DELETE", {
          lengthIsFriendsOfA: lengthIsFriendsOfA,
          lengthIsFriendsOfB: lengthIsFriendsOfB,
          userAId: userAId,
          userBId: userBId,
        });
      }
    });
  });
};
