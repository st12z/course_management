import { Request, Response } from "express";
import Course from "../../models/course.model";
import Topic from "../../models/topic.model";
import Lecture from "../../models/lecture.model";
import FavoriteCourse from "../../models/favorite-course.model";
import FeedBack from "../../models/feedback.model";
import User from "../../models/user.model";
import { formatDistance, parseISO } from "date-fns";
export const index = async (req: Request, res: Response) => {
  const slugTopic = req.params.slugTopic;
  const topic = await Topic.findOne({
    slug: slugTopic,
    deleted: false,
    status: "active",
  });
  const courses = await Course.find({
    topicId: topic.id,
    deleted: false,
    status: "active",
  });
  for (const course of courses) {
    course["price_special"] = course["price"] * (1 - course["discount"] / 100);
  }

  res.render("client/pages/courses/index", {
    pageTitle: "Trang danh sách khóa học",
    courses: courses,
  });
};
export const detail = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  const learningPaths = course["resources"]["learningPath"];
  let lectures = [];
  for (const learningPath of learningPaths) {
    const lectureId = learningPath;
    const lecture = await Lecture.findOne({ _id: lectureId });
    lectures.push(lecture);
  }
  course["price_special"] = course["price"] * (1 - course["discount"] / 100);
  const feedbacks = await FeedBack.find({ courseId: course.id }).sort({
    createdAt: -1,
  });
  for (const feedBack of feedbacks) {
    const userId = feedBack["userId"];
    const infoUser = await User.findOne({
      _id: userId,
      deleted: false,
      status: "active",
    }).select("fullName avatar createdAt");
    infoUser["createdAt"] = formatDistance(
      feedBack["createdAt"] as Date,
      new Date(),
      { addSuffix: true }
    );
    feedBack["infoUser"]=infoUser;
  }
  res.render("client/pages/courses/detail", {
    pageTitle: "Trang chi tiết khóa học",
    course: course,
    lectures: lectures,
    feedbacks: feedbacks,
  });
};

export const like = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const email = res.locals.user.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
    status: "active",
  });
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  const like = course["like"];
  let amountLike = like.length;
  if (!like.includes(user.id)) {
    await Course.updateOne({ slug: slugCourse }, { $push: { like: user.id } });
    amountLike += 1;
  }
  res.json({
    code: 200,
    messages: "Cập nhật thành công",
    like: amountLike,
  });
};
export const unlike = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const email = res.locals.user.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
    status: "active",
  });
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  const like = course["like"];
  let amountLike = like.length;
  if (like.includes(user.id)) {
    await Course.updateOne({ slug: slugCourse }, { $pull: { like: user.id } });
    amountLike -= 1;
  }
  res.json({
    code: 200,
    messages: "Cập nhật thành công",
    like: amountLike,
  });
};
export const tym = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  const email = res.locals.user.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
    status: "active",
  });
  const tym = course["tym"];
  let amountTym = tym.length;
  if (!tym.includes(user.id)) {
    await Course.updateOne({ slug: slugCourse }, { $push: { tym: user.id } });
    const dataFavorite = {
      courseId: course["id"],
      userId: user.id,
    };
    const favoriteSong = await FavoriteCourse.findOne({
      courseId: course.id,
      deleted: false,
      status: "active",
      userId: user.id,
    });
    if (!favoriteSong) {
      const newFavoriteSong = new FavoriteCourse(dataFavorite);
      newFavoriteSong.save();
      amountTym += 1;
    }
  }

  res.json({
    code: 200,
    messages: "Cập nhật thành công",
    tym: amountTym,
  });
};
export const untym = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const email = res.locals.user.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
    status: "active",
  });
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  const tym = course["tym"];
  let amountTym = tym.length;
  if (tym.includes(user.id)) {
    await Course.updateOne({ slug: slugCourse }, { $pull: { tym: user.id } });
    await FavoriteCourse.deleteOne({
      userId: user.id,
      courseId: course.id,
    });
    amountTym -= 1;
  }

  res.json({
    code: 200,
    messages: "Cập nhật thành công",
    tym: amountTym,
  });
};
export const feedBackPost = async (req: Request, res: Response) => {
  const rating = req.body.rating;
  const review = req.body.review;
  const course = await Course.findOne({
    slug: req.params.slugCourse,
    deleted: false,
    status: "active",
  });
  const userId=res.locals.user.id;
  const user =await User.findOne({_id:userId}).select("-password");
  const courseId = course.id;
  const feedBack = new FeedBack({
    userId: res.locals.user.id,
    rating: rating,
    review: review,
    courseId: courseId,
  });
  await feedBack.save();
  const feedBacks = await FeedBack.find({
    courseId: course.id,
  });
  const sumRating = feedBacks.reduce((sum, item) => sum + item.rating, 0);
  const countFeedBack = feedBacks.length;
  const ratingAvg = Math.round(sumRating / countFeedBack);
  await Course.updateOne(
    { slug: req.params.slugCourse },
    { rating: ratingAvg }
  );
  const elapsedTime= formatDistance(feedBack["createdAt"] as Date, new Date(), { addSuffix: true });
  res.json({
    code: 200,
    messages: "Gửi data lên server thành công",
    review: review,
    rating: rating,
    id: feedBack.id,
    infoUser:user,
    elapsedTime:elapsedTime,
    ratingAverage: ratingAvg,
  });
};
export const likeFeed = async (req: Request, res: Response) => {
  const feedBackId = req.body.id;
  const feedBack = await FeedBack.findOne({
    _id: feedBackId,
  });
  const user = res.locals.user;
  const like = feedBack["like"];
  let amountLike = like.length;
  if (!like.includes(user.id)) {
    await FeedBack.updateOne({ _id: feedBackId }, { $push: { like: user.id } });
    amountLike += 1;
  }

  res.json({
    code: 200,
    messages: "Gửi data lên server thành công",
    feedBackId: feedBackId,
    like: amountLike,
  });
};
export const unlikeFeed = async (req: Request, res: Response) => {
  const feedBackId = req.body.id;
  const feedBack = await FeedBack.findOne({
    _id: feedBackId,
  });
  const user = res.locals.user;
  const like = feedBack["like"];
  let amountLike = like.length;
  if (like.includes(user.id)) {
    await FeedBack.updateOne({ _id: feedBackId }, { $pull: { like: user.id } });
    amountLike -= 1;
  }

  res.json({
    code: 200,
    messages: "Gửi data lên server thành công",
    feedBackId: feedBackId,
    like: amountLike,
  });
};
export const deleteFeed = async (req: Request, res: Response) => {
  const feedBackId = req.params.id;
  const feedBack = await FeedBack.findOne({
    _id: feedBackId,
  });
  const courseId = feedBack.courseId;
  await FeedBack.deleteOne({ _id: feedBackId });
  const feedBacks = await FeedBack.find({
    courseId: courseId,
  });
  let ratingAverage = 0;
  if (feedBacks && feedBacks.length > 0) {
    const sumRating = feedBacks.reduce((sum, item) => sum + item.rating, 0);
    const countFeedBack = feedBacks.length;
    ratingAverage = Math.round(sumRating / countFeedBack);
  }
  await Course.updateOne({ _id: courseId }, { rating: ratingAverage });
  res.json({
    code: 200,
    messages: "Xóa thành công!",
    feedBackId: feedBackId,
    ratingAverage: ratingAverage,
  });
};
export const editFeed = async (req: Request, res: Response) => {
  const feedBackId = req.params.id;
  const rating = parseInt(req.body.rating);
  const review = req.body.review;
  console.log(rating, review);
  await FeedBack.updateOne(
    {
      _id: feedBackId,
    },
    {
      rating: rating,
      review: review,
    }
  );
  const feedBack = await FeedBack.findOne({
    _id: feedBackId,
  });
  const courseId = feedBack.courseId;
  const feedBacks = await FeedBack.find({
    courseId: courseId,
  });
  let ratingAverage = 0;
  if (feedBacks && feedBacks.length > 0) {
    const sumRating = feedBacks.reduce((sum, item) => sum + item.rating, 0);
    const countFeedBack = feedBacks.length;
    ratingAverage = Math.round(sumRating / countFeedBack);
  }
  await Course.updateOne({ _id: courseId }, { rating: ratingAverage });
  res.json({
    code: 200,
    messages: "Cập nhật thành công!",
    rating: rating,
    review: review,
    feedBackId: feedBackId,
    ratingAverage: ratingAverage,
  });
};
