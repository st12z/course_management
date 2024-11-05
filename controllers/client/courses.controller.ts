import { Request, Response } from "express";
import Course from "../../models/course.model";
import Topic from "../../models/topic.model";
import Lecture from "../../models/lecture.model";
import FavoriteCourse from "../../models/favorite-course.model";
import FeedBack from "../../models/feedback.model";
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
  res.render("client/pages/courses/detail", {
    pageTitle: "Trang chi tiết khóa học",
    course: course,
    lectures: lectures,
    feedbacks: feedbacks,
  });
};

export const like = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  console.log(slugCourse);
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });

  await Course.updateOne({ slug: slugCourse }, { like: course.like + 1 });

  res.json({
    code: 200,
    messages: "Cập nhật thành công",
    like: course["like"] + 1,
  });
};
export const unlike = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  await Course.updateOne({ slug: slugCourse }, { like: course.like - 1 });
  res.json({
    code: 200,
    messages: "Cập nhật thành công",
    like: course["like"] + -1,
  });
};
export const tym = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  await Course.updateOne({ slug: slugCourse }, { tym: course.tym + 1 });
  const dataFavorite = {
    courseId: course["id"],
  };
  const favoriteSong = await FavoriteCourse.findOne({
    courseId: course.id,
    deleted: false,
    status: "active",
  });
  if (!favoriteSong) {
    const newFavoriteSong = new FavoriteCourse(dataFavorite);
    newFavoriteSong.save();
  }

  res.json({
    code: 200,
    messages: "Cập nhật thành công",
    tym: course["tym"] + 1,
  });
};
export const untym = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  await Course.updateOne({ slug: slugCourse }, { tym: course.tym - 1 });
  res.json({
    code: 200,
    messages: "Cập nhật thành công",
    tym: course["tym"] - 1,
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
  const courseId = course.id;
  const feedBack = new FeedBack({
    userId: "",
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
  res.json({
    code: 200,
    messages: "Gửi data lên server thành công",
    review: review,
    rating: rating,
    id: feedBack.id,
    ratingAverage: ratingAvg,
  });
};
export const likeFeed = async (req: Request, res: Response) => {
  const feedBackId = req.body.id;
  const feedBack = await FeedBack.findOne({
    _id: feedBackId,
  });
  await FeedBack.updateOne({ _id: feedBackId }, { like: feedBack.like + 1 });
  res.json({
    code: 200,
    messages: "Gửi data lên server thành công",
    feedBackId: feedBackId,
    like: feedBack.like + 1,
  });
};
export const unlikeFeed = async (req: Request, res: Response) => {
  const feedBackId = req.body.id;
  const feedBack = await FeedBack.findOne({
    _id: feedBackId,
  });
  await FeedBack.updateOne({ _id: feedBackId }, { like: feedBack.like - 1 });
  res.json({
    code: 200,
    messages: "Gửi data lên server thành công",
    feedBackId: feedBackId,
    like: feedBack.like - 1,
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
