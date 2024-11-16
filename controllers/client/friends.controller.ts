import { Request, response, Response } from "express";
import User from "../../models/user.model";
import { friendSocket } from "../../socket/friend.socket";


export const index = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const requestFriends = user.requestFriends;
  const acceptFriends = user.acceptFriends;
  const isFriends=await User.find({
    _id:{$in :user.isFriends}
  }).select("id fullName avatar");
  friendSocket(res);
  res.render("client/pages/friends/index", {
    pageTitle: "Danh sách bạn bè",
    isFriends:isFriends,
    requestFriends: requestFriends,
    acceptFriends: acceptFriends,
  });
};
export const notFriends = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const isFriends = user.isFriends;
  const requestFriends = user.requestFriends;
  const acceptFriends = user.acceptFriends;

  friendSocket(res);

  const notFriends = await User.find({
    $and: [
      { _id: { $ne: user.id } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      {_id:{$nin:isFriends}}
    ],
  }).select("id fullName avatar");
  res.render("client/pages/friends/not-friends", {
    pageTitle: "Những người bạn có thể biết",
    notFriends: notFriends,
    requestFriends: requestFriends,
    acceptFriends: acceptFriends,
    isFriends: isFriends,
  });
};
export const acceptFriends=async(req:Request,res:Response)=>{
  const user = res.locals.user;
  const isFriends = user.isFriends;
  const requestFriends = user.requestFriends;
  const acceptFriends = await User.find({
    _id:{$in:user.acceptFriends}
  }).select("id fullName avatar");

  friendSocket(res);
  res.render("client/pages/friends/accept-friends", {
    pageTitle: "Những người bạn có thể biết",
    requestFriends: requestFriends,
    acceptFriends: acceptFriends,
    isFriends: isFriends,
  });
}

export const requestFriends=async(req:Request,res:Response)=>{
  const user = res.locals.user;
  const isFriends = user.isFriends;
  const acceptFriends = user.acceptFriends;
  const requestFriends = await User.find({
    _id:{$in:user.requestFriends}
  }).select("id fullName avatar");

  friendSocket(res);
  res.render("client/pages/friends/request-friends", {
    pageTitle: "Những người bạn có thể biết",
    requestFriends: requestFriends,
    acceptFriends: acceptFriends,
    isFriends: isFriends,
  });
}