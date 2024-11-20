import { Request, Response } from "express";
import { chatSocket } from "../../socket/chat.socket";
import Chat from "../../models/chat.model";
import User from "../../models/user.model";
import RoomChat from "../../models/room-chat.model";
import { convertSlug } from "../../helpers/convertSlug";
import { info } from "console";
export const index = async (req: Request, res: Response) => {
  const userId = res.locals.user.id;
  const chats = await Chat.find({});
  let roomChatIds = [];
  for (const chat of chats) {
    const roomChat = await RoomChat.findOne({ _id: chat["roomChatId"] });
    if (roomChat.users.some((user) => user.userId == userId)) {
      roomChatIds.push(chat["roomChatId"]);
    }
  }
  const latestMessages = await Chat.aggregate([
    {
      $match: {
        roomChatId: { $in: roomChatIds },
      },
    },
    {
      $sort: {
        createdAt: -1,
        _id: -1,
      },
    },
    {
      $group: {
        _id: "$roomChatId",
        message: { $first: "$$ROOT" },
      },
    },
  ]);
  for (const latestMessage of latestMessages) {
    let infoFriend = {};
    const userFriendId = latestMessage.message["userId"];
    if (userFriendId == userId) {
      const chat = await Chat.findOne({
        roomChatId: latestMessage.message.roomChatId,
        userId: { $ne: userId },
      });
      infoFriend = await User.findOne({
        _id: chat["userId"],
      }).select("id fullName avatar");
    } else {
      infoFriend = await User.findOne({
        _id: latestMessage.message["userId"],
      }).select("id fullName avatar slug");
    }
    const fullNameSplit = infoFriend["fullName"].split(" ");
    infoFriend["lastName"] = fullNameSplit[fullNameSplit.length - 1];
    latestMessage["infoFriend"] = infoFriend;
  }
  res.render("client/pages/chats/index", {
    pageTitle: "Trang nhắn tin",
    latestMessages: latestMessages,
  });
};
export const chat = async (req: Request, res: Response) => {
  chatSocket(req, res);
  const roomChatId = req.params.roomChatId;
  const chats = await Chat.find({
    roomChatId: roomChatId,
    deleted: false,
  });
  for (const chat of chats) {
    const userId = chat.userId;
    if (userId == res.locals.user.id) continue;
    const infoFriend = await User.findOne({
      _id: userId,
      deleted: false,
    }).select("id fullName avatar");
    chat["infoFriend"] = infoFriend;
  }
  res.render("client/pages/chats/chat", {
    roomChatId: roomChatId,
    chats: chats,
  });
};

export const suggest = async (req: Request, res: Response) => {
  const userId = res.locals.user.id;
  const chats = await Chat.find({});
  const keyword: string = `${req.query.keyword}`;
  const slug = convertSlug(keyword);
  const regexKeyword = new RegExp(slug, "i");

  let roomChatIds = [];
  for (const chat of chats) {
    const roomChat = await RoomChat.findOne({ _id: chat["roomChatId"] });
    if (roomChat.users.some((user) => user.userId == userId)) {
      roomChatIds.push(chat["roomChatId"]);
    }
  }
  const latestMessages = await Chat.aggregate([
    {
      $match: {
        roomChatId: { $in: roomChatIds },
      },
    },
    {
      $sort: {
        createdAt: -1,
        _id: -1,
      },
    },
    {
      $group: {
        _id: "$roomChatId",
        message: { $first: "$$ROOT" },
      },
    },
  ]);
  const latestMessagesNew = [];
  for (let latestMessage of latestMessages) {
    let infoFriend = {};
    const userFriendId = latestMessage.message["userId"];
    if (userFriendId == userId) {
      const chat = await Chat.findOne({
        roomChatId: latestMessage.message.roomChatId,
        userId: { $ne: userId },
      });
      infoFriend = await User.findOne({
        _id: chat["userId"],
      }).select("id fullName avatar slug");
    } else {
      infoFriend = await User.findOne({
        _id: latestMessage.message["userId"],
      }).select("id fullName avatar slug");
    }
    const fullNameSplit = infoFriend["fullName"].split(" ");
    if (fullNameSplit.length > 0) {
      infoFriend["lastName"] = fullNameSplit[fullNameSplit.length - 1];
    } else {
      infoFriend["lastName"] = infoFriend["fullName"];
    }
    const updatedInfoFriend = {
      avatar:infoFriend["avatar"],
      lastName: fullNameSplit[fullNameSplit.length - 1],
    };
    latestMessage["infoFriend"]=updatedInfoFriend;
    if (regexKeyword.test(infoFriend["slug"])) {
      latestMessagesNew.push(latestMessage);
    }
  }
  try {
    res.json({
      code: 200,
      latestMessages: latestMessagesNew,
      user: res.locals.user,
    });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};
